using System.Diagnostics;

namespace FMAnalyzer;

/// <summary>
/// Standalone scanner entry point — runs from FMAnalyzer.exe, no BepInEx required.
/// Polls for request.flag written by the web app, then reads FM26's memory externally.
/// </summary>
internal static class Program
{
    private static readonly string RequestFile = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "FMAnalyzer", "request.flag");

    // 0 = idle, 1 = dump in progress.
    private static int _dumpBusy;

    public static void Main(string[] args)
    {
        if (args.Contains("--now"))
        {
            Console.WriteLine("One-off dump mode geactiveerd.");
            TryStartDump(true).Wait();
            return;
        }

        Console.WriteLine($"FMAnalyzer Scanner — polling voor request.flag…");
        Console.WriteLine($"(Sluit dit venster om te stoppen)");

        while (true)
        {
            Thread.Sleep(1000);
            try
            {
                if (!File.Exists(RequestFile)) continue;
                File.Delete(RequestFile);
                TryStartDump(false);
            }
            catch { /* next tick */ }
        }
    }

    private static Task TryStartDump(bool synchronous = false)
    {
        if (Interlocked.CompareExchange(ref _dumpBusy, 1, 0) != 0) return Task.CompletedTask;
        Console.WriteLine("dump starten…");
        var task = Task.Run(() =>
        {
            try
            {
                var fmProcs = Process.GetProcessesByName("fm");
                if (fmProcs.Length == 0)
                {
                    Console.WriteLine("FM26 niet gevonden (process 'fm' niet actief).");
                    Dumper.WriteError("FM26 is niet gestart.");
                    return;
                }
                int pid = fmProcs[0].Id;
                Console.WriteLine($"FM26 gevonden: PID {pid}");
                Dumper.DumpAll(pid);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Dump mislukt: {e}");
                Dumper.WriteError("Dump mislukt: " + e.Message);
            }
            finally { Interlocked.Exchange(ref _dumpBusy, 0); }
        });

        if (synchronous) task.Wait();
        return task;
    }
}

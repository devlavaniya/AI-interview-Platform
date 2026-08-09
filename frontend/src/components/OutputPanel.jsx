import {
  Terminal,
  CheckCircle2,
  XCircle,
  Play,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

function OutputPanel({ output }) {
  return (
    <Card className="h-full rounded-none border-zinc-800 bg-[#181818]">

      <CardHeader className="border-b border-zinc-800 py-3">

        <div className="flex items-center justify-between">

          <CardTitle className="flex items-center gap-2 text-base text-white">

            <Terminal className="h-5 w-5 text-yellow-400" />

            Output Console

          </CardTitle>

          {output && (
            output.success ? (
              <Badge className="bg-green-600 text-white">

                <CheckCircle2 className="mr-1 h-3 w-3" />

                Success

              </Badge>
            ) : (
              <Badge variant="destructive">

                <XCircle className="mr-1 h-3 w-3" />

                Error

              </Badge>
            )
          )}

        </div>

      </CardHeader>

      <CardContent className="h-[calc(100%-65px)] overflow-auto p-0">

        {output === null ? (

          <div className="flex h-full flex-col items-center justify-center px-8 text-center">

            <div className="mb-5 rounded-full bg-yellow-400/10 p-5">

              <Play className="h-8 w-8 text-yellow-400" />

            </div>

            <h3 className="text-lg font-semibold text-white">

              Ready to Execute

            </h3>

            <p className="mt-3 max-w-md text-sm text-zinc-400">

              Run your code to view the program output,
              runtime errors, or execution result.

            </p>

          </div>

        ) : output.success ? (

          <pre className="h-full overflow-auto bg-[#0D1117] p-6 font-mono text-sm leading-7 text-green-400">

{output.output || "Program executed successfully."}

          </pre>

        ) : (

          <div className="space-y-5 p-6">

            {output.output && (

              <div>

                <h4 className="mb-3 font-semibold text-white">

                  Console Output

                </h4>

                <pre className="overflow-auto rounded-lg bg-[#0D1117] p-4 font-mono text-sm leading-6 text-zinc-300">

{output.output}

                </pre>

              </div>

            )}

            <div>

              <h4 className="mb-3 font-semibold text-red-400">

                Error

              </h4>

              <pre className="overflow-auto rounded-lg border border-red-500/20 bg-red-500/10 p-4 font-mono text-sm leading-6 text-red-400">

{output.error}

              </pre>

            </div>

          </div>

        )}

      </CardContent>

    </Card>
  );
}

export default OutputPanel;
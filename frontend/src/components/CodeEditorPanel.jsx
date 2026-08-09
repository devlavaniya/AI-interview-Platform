

import { useState } from "react";
import Editor from "@monaco-editor/react";

import {
  Play,
  Loader2,
  Bug,
  Info,
  RotateCcw,
  Type,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onDebugCode,
  debugBtnRef,
}) {
  const [fontSize, setFontSize] = useState(15);

  const handleReset = () => {
    const starter =
      LANGUAGE_CONFIG[selectedLanguage]?.template ||
      "";

    onCodeChange(starter);
  };

  return (
    <Card className="h-full border-zinc-800 bg-[#181818] rounded-none">

      <CardContent className="flex h-full flex-col p-0">

        {/* Toolbar */}

        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">

          {/* Left */}

          <div className="flex items-center gap-3">

            <Select
              value={selectedLanguage}
              onValueChange={(value) =>
                onLanguageChange({
                  target: {
                    value,
                  },
                })
              }
            >

              <SelectTrigger className="w-44">

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                {Object.entries(
                  LANGUAGE_CONFIG
                ).map(([key, lang]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    disabled={!lang.installed}
                  >
                    {lang.name}
                  </SelectItem>
                ))}

              </SelectContent>

            </Select>

            <Select
              value={String(fontSize)}
              onValueChange={(v) =>
                setFontSize(Number(v))
              }
            >

              <SelectTrigger className="w-24">

                <Type className="mr-2 h-4 w-4" />

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                {[14, 15, 16, 18, 20].map(
                  (size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                    >
                      {size}px
                    </SelectItem>
                  )
                )}

              </SelectContent>

            </Select>

            <TooltipProvider>

              <Tooltip>

                <TooltipTrigger>

                  <Info
                    className="cursor-pointer text-zinc-500"
                    size={18}
                  />

                </TooltipTrigger>

                <TooltipContent>

                  Installed compilers
                  determine available
                  languages.

                </TooltipContent>

              </Tooltip>

            </TooltipProvider>

          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >

              <RotateCcw className="mr-2 h-4 w-4" />

              Reset

            </Button>

            <Button
              ref={debugBtnRef}
              variant="secondary"
              size="sm"
              disabled={isRunning}
              onClick={onDebugCode}
            >

              <Bug className="mr-2 h-4 w-4" />

              Debug

            </Button>

            <Button
              size="sm"
              disabled={isRunning}
              onClick={onRunCode}
              className="bg-yellow-400 text-black hover:bg-yellow-300"
            >

              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  Running...

                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />

                  Run Code

                </>
              )}

            </Button>

          </div>

        </div>

        {/* Monaco */}

        <div className="flex-1 overflow-hidden">

          <Editor
            height="100%"
            language={
              LANGUAGE_CONFIG[selectedLanguage]
                .monacoLang
            }
            value={code}
            onChange={(value) =>
              onCodeChange(value || "")
            }
            theme="vs-dark"
            options={{
              fontSize,
              fontLigatures: true,
              minimap: {
                enabled: false,
              },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              padding: {
                top: 20,
              },
              lineNumbers: "on",
              roundedSelection: true,
              renderLineHighlight: "all",
            }}
          />

        </div>

      </CardContent>

    </Card>
  );
}

export default CodeEditorPanel;
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { TitleBar } from "@/components/title-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import reactLogo from "./assets/react.svg";
import shadcnLogo from "./assets/shadcn.svg";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="flex min-h-svh flex-col">
      <TitleBar />
      <div className="flex flex-1 flex-col bg-background">
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
          <h1 className="text-3xl font-medium tracking-tight">
            Welcome to Tauri + React + shadcn/ui
          </h1>

          <div className="flex justify-center">
            <a href="https://vite.dev" target="_blank" rel="noopener">
              <img src="/vite.svg" className="size-24 p-6" alt="Vite logo" />
            </a>
            <a href="https://tauri.app" target="_blank" rel="noopener">
              <img src="/tauri.svg" className="size-24 p-6" alt="Tauri logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener">
              <img src={reactLogo} className="size-24 p-6" alt="React logo" />
            </a>
            <a href="https://ui.shadcn.com" target="_blank" rel="noopener">
              <img
                src={shadcnLogo}
                className="size-24 p-6 dark:invert"
                alt="shadcn/ui logo"
              />
            </a>
          </div>
          <p className="text-muted-foreground">
            Click on the Tauri, Vite, React, and shadcn/ui logos to learn more.
          </p>

          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              greet();
            }}
          >
            <Input
              id="greet-input"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Enter a name..."
            />
            <Button type="submit">Greet</Button>
          </form>
          <p>{greetMsg}</p>
        </main>
      </div>
    </div>
  );
}

export default App;

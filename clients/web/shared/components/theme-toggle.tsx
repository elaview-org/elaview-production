"use client";

import * as React from "react";
import {Monitor, Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";

import {Button} from "@/shared/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export function ThemeToggle() {
    const {setTheme, theme} = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
                {!mounted && <Monitor className="h-[1.2rem] w-[1.2rem]"/>}
                {mounted && theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]"/>}
                {mounted && theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]"/>}
                {mounted && theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]"/>}
                <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4"/>
                <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4"/>
                <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4"/>
                <span>System</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>;
}
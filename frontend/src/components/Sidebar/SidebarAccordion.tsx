import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion.js";
import { ScrollArea } from "../ui/scroll-area.js";

interface SidebarAccordionItemProps {
  value: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsed: boolean;
  iconClassName?: string;
}

export function SidebarAccordionItem({ value, title, icon, children, collapsed, iconClassName }: SidebarAccordionItemProps) {
  return (
    <AccordionItem
      value={value}
      className={`bg-white rounded-xl border ${!collapsed ? "shadow-sm" : ""}`}
    >
      <AccordionTrigger
        disabled={collapsed}
        className={`p-3 text-left hover:no-underline ${collapsed ? "justify-center px-2 cursor-default [&>svg]:hidden" : "justify-between px-3"}`}
      >
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className={`p-1.5 rounded-lg ${collapsed ? "" : "bg-gray-100"} ${iconClassName}`}>{icon}</div>
          {!collapsed && <span className="font-semibold text-sm">{title}</span>}
        </div>
      </AccordionTrigger>

      {!collapsed && (
        <AccordionContent className="p-3 pt-0 max-h-64 overflow-hidden">
          <ScrollArea className="h-64 pr-2">{children}</ScrollArea>
        </AccordionContent>
      )}
    </AccordionItem>
  );
}

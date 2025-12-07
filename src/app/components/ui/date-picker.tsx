"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { cn } from "./utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

// Simple date formatter (since date-fns might not be installed)
function formatDate(date: Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    className,
    disabled,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "font-din-arabic w-full px-4 py-3.5 border bg-transparent text-left text-black placeholder-black/50 focus:outline-none focus:border-black transition-all duration-300 flex items-center justify-between",
                        !value && "text-black/50",
                        className
                    )}
                    style={{ borderColor: "#D8D2C7" }}
                >
                    <span>
                        {value ? formatDate(value) : placeholder}
                    </span>
                    <CalendarIcon className="h-4 w-4 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 border shadow-lg !bg-white !text-black rounded-none"
                style={{ borderColor: "#D8D2C7" }}
                align="start"
                sideOffset={4}
            >
                <style dangerouslySetInnerHTML={{
                    __html: `
            @supports (color: color-mix(in lab, red, red)) {
              .rdp * {
                outline-color: #333 !important;
              }
            }
            .rdp-chevron {
              fill: #333 !important;
              color: #333 !important;
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
            }
            .rdp-button_reset .rdp-chevron {
              fill: #333 !important;
              color: #333 !important;
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
            }
            .rdp-nav_button .rdp-chevron {
              fill: #333 !important;
              color: #333 !important;
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
            }
            .rdp {
              --rdp-selected-border: #333 !important;
            }
            .rdp-selected .rdp-day_button {
              border: 2px solid #333 !important;
              --rdp-selected-border: #333 !important;
            }
            .rdp-selected .rdp-day_button:hover {
              border: 2px solid #333 !important;
            }
            .rdp-selected .rdp-day_button:focus {
              border: 2px solid #333 !important;
            }
              .rdp-day_button{
              color: #333 !important;
              }
              .rdp-caption_label {
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
              }
              .rdp-dropdown,
              .rdp-dropdown_month,
              .rdp-dropdown_year {
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
              color: #333 !important;
              background-color: #ffffff !important;
              border: 1px solid #D8D2C7 !important;
              border-radius: 0 !important;
              padding: 0.375rem 0.75rem !important;
              font-size: 0.875rem !important;
              }
              .rdp-dropdown:focus,
              .rdp-dropdown_month:focus,
              .rdp-dropdown_year:focus {
              border-color: #000000 !important;
              outline: none !important;
              }
              .rdp-dropdown_root:focus,
              .rdp-dropdown_root:focus-visible,
              .rdp-dropdown_root:focus-within {
              outline: none !important;
              outline-offset: 0 !important;
              box-shadow: none !important;
              }
              .rdp-dropdown_root *:focus,
              .rdp-dropdown_root *:focus-visible {
              outline: none !important;
              outline-offset: 0 !important;
              box-shadow: none !important;
              }
              .rdp-caption_dropdowns {
              display: flex !important;
              gap: 0.5rem !important;
              justify-content: center !important;
              align-items: center !important;
              }
              .rdp-month_caption {
              font-size: 1rem !important;
              font-family: 'DIN Next Arabic', Arial, sans-serif !important;
              letter-spacing: 0.1em !important;
              font-weight: 400 !important;
              }
          `
                }} />
                <DayPicker
                    mode="single"
                    selected={value}
                    onSelect={(date) => {
                        onChange?.(date);
                        setOpen(false);
                    }}
                    captionLayout="dropdown"
                    fromYear={1900}
                    toYear={new Date().getFullYear() + 10}
                    className="p-5 bg-[#e3e3d8] rounded-none"
                    components={{
                        IconLeft: ({ className, ...props }: { className?: string }) => (
                            <ChevronLeft className={cn("h-4 w-4 text-black", className)} {...props} />
                        ),
                        IconRight: ({ className, ...props }: { className?: string }) => (
                            <ChevronRight className={cn("h-4 w-4 text-black", className)} {...props} />
                        ),
                    } as any}
                />
            </PopoverContent>
        </Popover>
    );
}


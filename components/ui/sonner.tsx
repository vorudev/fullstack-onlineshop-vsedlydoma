"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-800 group-[.toaster]:border-blue-100 group-[.toaster]:shadow-xl group-[.toaster]:border-2",
          description: "group-[.toast]:text-slate-600",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700 group-[.toast]:font-medium group-[.toast]:px-4",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 group-[.toast]:hover:bg-slate-200",
          closeButton:
            "group-[.toast]:bg-white group-[.toast]:text-slate-400 group-[.toast]:border-slate-200 group-[.toast]:hover:text-slate-600",
          success: 
            "group-[.toaster]:bg-white group-[.toaster]:border-blue-600 group-[.toaster]:text-slate-800",
          error: 
            "group-[.toaster]:bg-white group-[.toaster]:border-red-500 group-[.toaster]:text-slate-800",
          warning:
            "group-[.toaster]:bg-white group-[.toaster]:border-amber-500 group-[.toaster]:text-slate-800",
          info:
            "group-[.toaster]:bg-white group-[.toaster]:border-blue-400 group-[.toaster]:text-slate-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

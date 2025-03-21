import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            }}
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={{
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            }}
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    if (variant === "floating") {
      return (
        <div
          ref={ref}
          data-sidebar="sidebar"
          data-variant={variant}
          data-side={side}
          data-state={state}
          data-collapsible={collapsible}
          className={cn(
            "group/sidebar fixed inset-y-0 z-50 flex h-full flex-col bg-sidebar text-sidebar-foreground shadow-md transition-[width] duration-200 ease-in-out data-[collapsible=icon]:overflow-hidden data-[state=collapsed]:opacity-100 data-[collapsible=icon]:data-[state=collapsed]:w-[--sidebar-width-icon] data-[collapsible=icon]:data-[state=expanded]:w-[--sidebar-width] data-[side=left]:left-0 data-[side=right]:right-0",
            className
          )}
          {...props}
        >
          {children}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        data-sidebar="sidebar"
        data-variant={variant}
        data-side={side}
        data-state={state}
        data-collapsible={collapsible}
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col transition-[width] duration-200 ease-in-out data-[variant=sidebar]:bg-sidebar data-[variant=sidebar]:text-sidebar-foreground data-[variant=inset]:min-h-[var(--inset-min-height,_100%)] data-[variant=inset]:w-full data-[collapsible=icon]:overflow-hidden data-[collapsible=icon]:data-[state=collapsed]:w-[--sidebar-width-icon] data-[collapsible=icon]:data-[state=expanded]:w-[--sidebar-width] data-[side=left]:border-r data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { state, setOpen, setOpenMobile, isMobile } = useSidebar()

    function handleCloseClick() {
      if (isMobile) {
        setOpenMobile(false)
      } else {
        setOpen(false)
      }
    }

    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn(
          "flex h-14 items-center border-b px-4 group-data-[collapsible=icon]:data-[state=collapsed]:px-2 group-data-[collapsible=icon]:data-[state=collapsed]:justify-center",
          className
        )}
        {...props}
      >
        {state === "expanded" ? (
          <>
            {children}
            <div className="ml-auto hidden md:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseClick}
                className="size-6 shrink-0 rounded-full"
              >
                <PanelLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
          </>
        ) : (
          <div className="flex w-full flex-1 flex-col gap-1">
            <div className="text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="h-8 w-8 shrink-0 rounded-full p-0"
              >
                <PanelLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarHeaderAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="header-action"
      className={cn(
        "ml-auto hidden h-full items-center md:flex group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarHeaderAction.displayName = "SidebarHeaderAction"

const SidebarBody = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="body"
      className={cn(
        "flex-1 overflow-y-auto py-2 group-data-[collapsible=icon]:data-[state=collapsed]:px-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
SidebarBody.displayName = "SidebarBody"

const SidebarSearch = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { state } = useSidebar()

    return (
      <div
        ref={ref}
        data-sidebar="search"
        className={cn(
          "group/search relative mb-2 px-4 group-data-[collapsible=icon]:data-[state=collapsed]:hidden",
          className
        )}
      >
        <Input
          ref={ref}
          type="search"
          className="h-8 w-full"
          placeholder="Search..."
          {...props}
        />
      </div>
    )
  }
)
SidebarSearch.displayName = "SidebarSearch"

const SidebarFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "mt-auto flex items-center gap-2 border-t p-4 group-data-[collapsible=icon]:data-[state=collapsed]:flex-col-reverse group-data-[collapsible=icon]:data-[state=collapsed]:items-center group-data-[collapsible=icon]:data-[state=collapsed]:px-2 group-data-[collapsible=icon]:data-[state=collapsed]:py-3 group-data-[collapsible=icon]:data-[state=collapsed]:gap-1",
        className
      )}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      />
    )
  }
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    return (
      <Comp
        ref={ref}
        data-sidebar="group-label"
        className={cn(
          "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        data-sidebar="group-action"
        className={cn(
          "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          // Increases the hit area of the button on mobile.
          "after:absolute after:-inset-2 after:md:hidden",
          "group-data-[collapsible=icon]:hidden",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
)
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
)
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-0 h-8 w-8 p-0 text-sidebar-foreground/50 hover:text-sidebar-foreground outline-none ring-sidebar-ring transition-colors hover:bg-transparent focus-visible:ring-2 active:bg-transparent [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:!hidden",
        className
      )}
      {...props}
    />
  )
)
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarDivider = React.forwardRef(
  ({ className, ...props }, ref) => (
    <Separator
      ref={ref}
      data-sidebar="divider"
      decorative
      className={cn("mx-2 my-2 bg-sidebar-foreground/20", className)}
      {...props}
    />
  )
)
SidebarDivider.displayName = "SidebarDivider"

const SidebarSpacer = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="spacer"
      className={cn("h-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SidebarSpacer.displayName = "SidebarSpacer"

const SidebarSkeleton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="skeleton"
      className={cn("px-2", className)}
      {...props}
    >
      <div className="mb-2 flex h-14 items-center justify-center border-b px-4">
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="ml-auto h-6 w-6" />
      </div>
      <div className="px-2 py-2">
        <Skeleton className="mb-2 h-8 w-[120px]" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="mt-1 h-8 w-full" />
        <Skeleton className="mt-1 h-8 w-full" />
      </div>
    </div>
  )
)
SidebarSkeleton.displayName = "SidebarSkeleton"

const SidebarMenuSkeleton = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex flex-col gap-1 px-2", className)}
      {...props}
    >
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
)
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSubItem = React.forwardRef(
  ({ ...props }, ref) => <li ref={ref} {...props} />
)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef(
  ({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"

    return (
      <Comp
        ref={ref}
        data-sidebar="menu-sub-button"
        data-size={size}
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarHeaderAction,
  SidebarBody,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarSpacer,
  SidebarDivider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarSearch,
  SidebarSkeleton,
  SidebarMenuSkeleton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} 
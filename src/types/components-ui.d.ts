import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

declare module "@/components/ui/tabs" {
  type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
  export const Tabs: React.FC<TabsProps>;

  type TabsListElement = React.ElementRef<typeof TabsPrimitive.List>;
  type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
  export const TabsList: React.ForwardRefExoticComponent<
    TabsListProps & React.RefAttributes<TabsListElement>
  >;

  type TabsTriggerElement = React.ElementRef<typeof TabsPrimitive.Trigger>;
  type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;
  export const TabsTrigger: React.ForwardRefExoticComponent<
    TabsTriggerProps & React.RefAttributes<TabsTriggerElement>
  >;

  type TabsContentElement = React.ElementRef<typeof TabsPrimitive.Content>;
  type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;
  export const TabsContent: React.ForwardRefExoticComponent<
    TabsContentProps & React.RefAttributes<TabsContentElement>
  >;
}

declare module "@/components/ui/badge" {
  type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

  interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: BadgeVariant;
  }

  export const Badge: React.FC<BadgeProps>;
  export const badgeVariants: (options: { variant?: BadgeVariant }) => string;
}

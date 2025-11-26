import * as React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "bg-primary text-gray-900",
        secondary: "bg-gray-200 text-gray-900",
    };

    return (
        <div
            ref={ref}
            className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)}
            {...props}
        />
    );
});
Badge.displayName = "Badge";
export { Badge };
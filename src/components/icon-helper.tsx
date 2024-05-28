import React from "react";
import * as LucideIcons from "lucide-react";

// Define a type for the LucideIcons object
type LucideIconComponent = keyof typeof LucideIcons;

const Icon: React.FC<{
  name: LucideIconComponent;
  size?: number;
  className?: string;
}> = ({ name, size, className, ...props }) => {
  // Check if the icon exists in LucideIcons
  if (LucideIcons[name]) {
    // Dynamically render the Lucide icon component
    const IconComponent = LucideIcons[name] as React.ComponentType<any>;
    return <IconComponent className={className} size={size} {...props} />;
  } else {
    // Return null or handle the case where the icon doesn't exist
    console.warn(`Icon '${name}' does not exist.`);
    return null;
  }
};

export default Icon;

import {  Download, Pencil, Plus, Printer, Search, Trash } from "lucide-react";
import { actionButtonVariants } from "./variant";
import Button from "../Button";

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onAdd?: () => void;
  onView?: () => void;
  onPrint?: () => void;
  variant?: "PRIMARY" | "SECONDARY";
  size?:"SMALL" | "ICON"
}

export default function ActionButton({ onEdit, onDelete, onDownload, onAdd, onView, onPrint,size="ICON", variant = "PRIMARY" }: Props) {
  return (
<div className="flex items-center gap-3">
      {onView && 
      <Button 
     variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
      size={size}
      className={size === "SMALL" ? actionButtonVariants({ intent: "view", variant }) : ""} 
      onClick={onView} icon={<Search size={20}  />} 
       />}
      {onEdit && 
      <Button 
     variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
      size={size}
      className={size === "SMALL" ? actionButtonVariants({ intent: "edit", variant }) : ""} 
      onClick={onEdit} icon={<Pencil size={20}  />} 
       />}
      {onAdd && 
      <Button 
     variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
      size={size}
      className={size === "SMALL" ? actionButtonVariants({ intent: "edit", variant }) : ""} 
      onClick={onAdd} icon={<Plus size={20}  />} 
       />}
      {onDelete && 
      <Button 
     variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
      size={size}
     className={size === "SMALL" ? actionButtonVariants({ intent: "delete", variant }) : ""} 
      onClick={onDelete} icon={<Trash size={20}   />} 
       />}
       
  {onDownload && (
  <Button
   variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
    size={size}
    onClick={onDownload}
    className={size === "SMALL" ? actionButtonVariants({ intent: "edit", variant }) : ""} 
    icon={<Download
    size={20} 
       />}
  />
)}

      {onPrint && 
      <Button 
     variant={size === "SMALL" ? "PLAIN" : "OUTLINE"}
      size={size}
      className={size === "SMALL" ? actionButtonVariants({ intent: "view", variant }) : ""} 
      onClick={onPrint} icon={<Printer 
        size={20}  />} 
      />
      }
    </div>
  )
}

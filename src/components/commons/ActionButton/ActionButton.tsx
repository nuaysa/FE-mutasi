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
}

export default function ActionButton({ onEdit, onDelete, onDownload, onAdd, onView, onPrint, variant = "PRIMARY" }: Props) {
  return (
    <div className="flex items-center gap-3">
      {onView && 
      <Button 
      variant="OUTLINE" 
      size="ICON"
      onClick={onView} icon={<Search  className={actionButtonVariants({ intent: "view", variant })} />} />}
      {onEdit && 
      <Button 
      variant="OUTLINE" 
      size="ICON"
      onClick={onEdit} icon={<Pencil  className={actionButtonVariants({ intent: "edit", variant })} />} />}
      {onAdd && 
      <Button 
      variant="OUTLINE" 
      size="ICON"
      onClick={onAdd} icon={<Plus  className={actionButtonVariants({ intent: "edit", variant })} />} />}
      {onDelete && 
      <Button 
      variant="OUTLINE" 
      size="ICON"
      onClick={onDelete} icon={<Trash  className={actionButtonVariants({ intent: "delete", variant })}/>} />}
  {onDownload && (
  <Button
    variant="OUTLINE"
    size="ICON"
    onClick={onDownload}
    icon={<Download className={actionButtonVariants({ intent: "edit", variant })} />}
  />
)}

      {onPrint && 
      <Button 
      variant="OUTLINE" 
      size="ICON"
      onClick={onPrint} icon={<Printer className={actionButtonVariants({ intent: "view", variant })} size={24} />} />}
    </div>
  );
}

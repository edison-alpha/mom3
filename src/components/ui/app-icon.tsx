"use client";

import { Icon as IconifyIcon, type IconProps as IconifyProps } from "@iconify/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  Layers3,
  LoaderCircle,
  LogOut,
  Network,
  Paperclip,
  Plus,
  ReceiptText,
  RefreshCw,
  ScanLine,
  Send,
  SlidersHorizontal,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";

type AppIconProps = Omit<IconifyProps, "icon"> & {
  icon: string;
};

const LOCAL_LUCIDE_ICONS: Record<string, LucideIcon> = {
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "arrow-up": ArrowUp,
  "arrow-up-down": ArrowUpDown,
  "check-circle": CheckCircle,
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  copy: Copy,
  delete: Trash2,
  "external-link": ExternalLink,
  eye: Eye,
  "eye-off": EyeOff,
  "layers-3": Layers3,
  "loader-circle": LoaderCircle,
  "log-out": LogOut,
  network: Network,
  paperclip: Paperclip,
  plus: Plus,
  "receipt-text": ReceiptText,
  "refresh-cw": RefreshCw,
  "scan-line": ScanLine,
  send: Send,
  "sliders-horizontal": SlidersHorizontal,
  x: X,
};

export function AppIcon({ icon, ...props }: AppIconProps) {
  if (icon.startsWith("lucide:")) {
    const LocalIcon = LOCAL_LUCIDE_ICONS[icon.slice("lucide:".length)];

    if (LocalIcon) {
      return <LocalIcon {...props} />;
    }
  }

  return <IconifyIcon icon={icon} {...props} />;
}

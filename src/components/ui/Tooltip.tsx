import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Info } from "lucide-react";
import { useState, type ReactNode } from "react";

interface InfoTooltipProps {
  content: ReactNode;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          className="hidden sm:inline-flex items-center justify-center text-(--g-20)/50 hover:text-(--g-20) transition-colors cursor-help"
          render={<span />}
        >
          <Info size={12} />
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={6}>
            <BaseTooltip.Popup className="max-w-[280px] rounded-lg bg-(--g-12) px-3 py-2 text-xs text-white shadow-lg transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0">
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>

      <BaseDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <BaseDialog.Trigger
          className="sm:hidden inline-flex items-center justify-center text-(--g-20)/50 active:text-(--g-20) transition-colors"
          render={<button type="button" />}
        >
          <Info size={12} />
        </BaseDialog.Trigger>
        <BaseDialog.Portal>
          <BaseDialog.Backdrop className="fixed inset-0 z-200 transition-opacity data-starting-style:opacity-0 data-ending-style:opacity-0" />
          <BaseDialog.Popup className="fixed bottom-4 left-4 right-4 z-201 bg-white border border-(--g-88) rounded-xl p-4 shadow-xl outline-none transition-all data-starting-style:opacity-0 data-starting-style:translate-y-4 data-ending-style:opacity-0 data-ending-style:translate-y-4">
            <div className="text-sm text-(--g-12)">{content}</div>
            <BaseDialog.Close
              className="mt-4 w-full py-2 text-sm font-medium text-(--g-20) bg-(--g-96) rounded-lg active:bg-(--g-92) transition-colors"
              render={<button type="button" />}
            >
              Got it
            </BaseDialog.Close>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}

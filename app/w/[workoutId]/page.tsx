import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function WorkoutViewer() {
  return (
    <div className="min-h-[calc(100vh-5.75rem)] flex justify-center items-center">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel minSize={"30"}>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={"30"}>Two</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

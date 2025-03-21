import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ThumbnailGenerateModalProps {
  videoId: string;
  open: boolean;
  onOpenChage: (open: boolean) => void;
}

const formSchema = z.object({
  prompt: z.string().min(10),
});

export const ThumbnailGenerateModal = ({
  videoId,
  open,
  onOpenChage,
}: ThumbnailGenerateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
    onSuccess: () => {
      toast.success("Background job started", {
        description: "This may take some time",
      });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    generateThumbnail.mutate({ prompt: data.prompt, id: videoId });
    form.reset();
    onOpenChage(false);
  };

  return (
    <ResponsiveModal
      title="Generate a thumbnail"
      open={open}
      onOpenChange={onOpenChage}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="resize-none pr-10 min-h-[calc(1.5rem*5)]"
                    placeholder="A description of wanted thumbnail"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-5">
            <Button disabled={generateThumbnail.isPending} type="submit">Generate</Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

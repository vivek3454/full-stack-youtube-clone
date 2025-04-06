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
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChage: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenChage,
}: PlaylistCreateModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = trpc.useUtils();
  const createPlaylist = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist created");
      utils.playlists.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    createPlaylist.mutate(data);
    form.reset();
    onOpenChage(false);
  };

  return (
    <ResponsiveModal
      title="Create a playlist"
      open={open}
      onOpenChange={onOpenChage}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favorite videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end mt-5">
            <Button disabled={createPlaylist.isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

import { FeatureGroupDto, UpdateFeaturesDto, featuresDelete, featuresUpdate } from "@/client";
import { v4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { PermissionProvider } from "@/lib/utils";
import { useFeatures } from "@/lib/hooks/useFeatures";
import { useToast } from "../ui/use-toast";
import { QueryNames } from "@/lib/hooks/QueryConstants";
import { Checkbox } from "../ui/checkbox";

export type FeatureListProps = {
  onDismiss: () => void;
  tenantId: string;
};

export const FeatureList = ({ onDismiss, tenantId }: FeatureListProps) => {
  const { data } = useFeatures(PermissionProvider.T, tenantId);
  const queryClient = useQueryClient();
  const [enableSetting, setEnableSetting] = useState<boolean>(false);
  const [enableEmailSetting, setEnableEmailSetting] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { handleSubmit } = useForm();
  const { toast } = useToast();

  const onCloseEvent = () => {
    setOpen(false);
    onDismiss();
  };

  useEffect(() => {
    setOpen(true);
    data?.groups?.forEach((g) => {
      g.features?.forEach((f) => {
        if (f.name === "SettingManagement.Enable" && f.value === "true") {
          setEnableSetting(true);
        } else if (
          f.name === "SettingManagement.AllowChangingEmailSettings" &&
          f.value === "true"
        ) {
          setEnableEmailSetting(true);
        }
      });
    });
    return () => {
      queryClient.invalidateQueries({ queryKey: [QueryNames.GetFeatures] });
      queryClient.invalidateQueries({ queryKey: [QueryNames.GetTenants] });
      queryClient.invalidateQueries({ queryKey: [PermissionProvider.T] });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDismiss, data]);

  const onCheckedEvent = (value: boolean, name: string) => {
    if (name === "SettingManagement.Enable") {
      setEnableSetting(value);
    } else if (name === "SettingManagement.AllowChangingEmailSettings") {
      setEnableEmailSetting(value);
    }
  };

  const onSubmit = async (data: unknown) => {
    try {
      const featureUpdateDto = {} as UpdateFeaturesDto;
      featureUpdateDto.features = [
        {
          name: "SettingManagement.Enable",
          value: enableSetting.toString(),
        },
        {
          name: "SettingManagement.AllowChangingEmailSettings",
          value: enableEmailSetting.toString(),
        },
      ];

      await featuresUpdate({
        providerKey: PermissionProvider.T,
        providerName: tenantId,
        requestBody: featureUpdateDto,
      });
      toast({
        title: "Success",
        description: "Features Update Successfully",
        variant: "default",
      });
      onCloseEvent();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Failed",
          description: "Features update wasn't successfull.",
          variant: "destructive",
        });
      }
    }
  };

  const onResetToDefaultEvent = async () => {
    try {
      await featuresDelete({
        providerKey: PermissionProvider.T, 
        providerName: tenantId
      });
      toast({
        title: "Success",
        description: "Features has been set to default.",
        variant: "default",
      });
      onCloseEvent();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Failed",
          description: "Features wasn't able to reset tp default.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <section className="p-3">
      <Dialog open={open} onOpenChange={onCloseEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Features</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(10rem,_1fr)_auto] gap-2 items-baseline">
              <div className=" p-3">
                {data?.groups?.map((el: FeatureGroupDto) => (
                  <span key={v4()}>{el.displayName}</span>
                ))}
              </div>
              <div className="p-3 mt-5">
                {data?.groups?.map((el: FeatureGroupDto) => (
                  <div key={v4()}>
                    <h3 className="text-xl font-medium">{el.displayName}</h3>
                    <hr className=" w-full mt-2 pb-2" />
                    {el.features?.map((feature) => (
                      <div key={v4()} className="text-base mt-2">
                        <Checkbox
                          id={`${feature.name}_enable`}
                          name={feature.name!}
                          checked={
                            feature.name === "SettingManagement.Enable"
                              ? enableSetting
                              : enableEmailSetting
                          }
                          onCheckedChange={(checked) =>
                            onCheckedEvent(!!checked.valueOf(), feature.name!)
                          }
                        />
                        <label
                          htmlFor={`${feature.name}_enable`}
                          className="text-sm font-medium leading-none "
                        >
                          <span className="pl-2 ">{feature.displayName}</span>
                        </label>
                        <p className=" text-xs pl-6 pt-1">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-5">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onResetToDefaultEvent();
                }}
              >
                Reset to default
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onCloseEvent();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

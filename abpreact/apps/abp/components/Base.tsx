import i18n from "@abp/utils/i18n";
import { useAppConfig } from "@abpreact/hooks";
import React, { ReactNode } from "react";
import Loader from "./Loader";

type Props = {
  children: ReactNode;
};

const BaseComponent = (props: Props) => {
  const { isLoading, data } = useAppConfig();
  i18n.set(
    data?.localization?.currentCulture?.cultureName!,
    data?.localization?.values
  );
  return <>{isLoading ? <Loader /> : props.children}</>;
};

export default BaseComponent;

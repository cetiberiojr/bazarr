import React, { FunctionComponent } from "react";
import { Row } from "react-bootstrap";
import ContentHeaderButton, { ContentHeaderAsyncButton } from "./Button";
import ContentHeaderGroup from "./Group";

declare type Header = FunctionComponent & {
  Button: typeof ContentHeaderButton;
  AsyncButton: typeof ContentHeaderAsyncButton;
  Group: typeof ContentHeaderGroup;
};

export const ContentHeader: Header = (props) => {
  const { children } = props;
  return (
    <Row className="content-header">
      <div className="d-flex flex-nowrap flex-grow-1 bg-dark p-2">
        {children}
      </div>
    </Row>
  );
};

ContentHeader.Button = ContentHeaderButton;
ContentHeader.Group = ContentHeaderGroup;
ContentHeader.AsyncButton = ContentHeaderAsyncButton;

export default ContentHeader;
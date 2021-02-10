import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {
  BasicModal,
  BasicModalProps,
  Selector,
  useCloseModal,
  usePayload,
  useShowModal,
  useWhenModalShow,
} from "../../components";
import { ColCard, useLatestMergeArray, useUpdateArray } from "../components";
import { notificationsKey } from "../keys";

interface ModalProps {
  selections: readonly NotificationInfo[];
}

const notificationComparer = (
  one: NotificationInfo,
  another: NotificationInfo
) => one.name === another.name;

const NotificationModal: FunctionComponent<ModalProps & BasicModalProps> = ({
  selections,
  ...modal
}) => {
  const options = useMemo<SelectorOption<NotificationInfo>[]>(
    () =>
      selections
        .filter((v) => !v.enabled)
        .map((v) => ({
          label: v.name,
          value: v,
        })),
    [selections]
  );

  const update = useUpdateArray<NotificationInfo>(
    notificationsKey,
    notificationComparer
  );

  const [current, setCurrent] = useState<NotificationInfo | undefined>();

  const item = usePayload<NotificationInfo>(modal.modalKey);

  useWhenModalShow(modal.modalKey, () => {
    setCurrent(item);
  });

  const updateUrl = useCallback(
    (s: string) => {
      if (current) {
        const newCurrent = { ...current };
        newCurrent.url = s;
        setCurrent(newCurrent);
      }
    },
    [current]
  );

  const closeModal = useCloseModal();

  const canSave =
    current !== undefined && current.url !== null && current.url.length !== 0;

  const footer = useMemo(
    () => (
      <React.Fragment>
        {/* TODO: Test Button */}
        {/* <Button disabled={!canSave} variant="outline-secondary">
          Test
        </Button> */}
        <Button
          hidden={item === undefined}
          variant="danger"
          onClick={() => {
            if (current) {
              current.enabled = false;
              current.url = null;
              update(current);
            }
            closeModal();
          }}
        >
          Remove
        </Button>
        <Button
          disabled={!canSave}
          onClick={() => {
            if (current) {
              current.enabled = true;
              update(current);
            }
            closeModal();
          }}
        >
          Save
        </Button>
      </React.Fragment>
    ),
    [canSave, closeModal, current, update, item]
  );

  return (
    <BasicModal title="Notification" footer={footer} {...modal}>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Selector
              disabled={item !== undefined}
              options={options}
              value={item}
              onChange={(k) => setCurrent(k)}
              label={(v) => v.name}
            ></Selector>
          </Col>
          <Col hidden={current === undefined}>
            <Form.Group className="mt-4">
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="URL"
                value={current?.url ?? ""}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  updateUrl(value);
                }}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    </BasicModal>
  );
};

export const NotificationView: FunctionComponent = () => {
  const notifications = useLatestMergeArray<NotificationInfo>(
    notificationsKey,
    notificationComparer,
    (settings) => settings.notifications.providers
  );

  const showModal = useShowModal();

  const elements = useMemo(() => {
    return notifications
      ?.filter((v) => v.enabled)
      .map((v, idx) => (
        <ColCard
          key={idx}
          header={v.name}
          onClick={() => showModal("notifications", v)}
        ></ColCard>
      ));
  }, [notifications, showModal]);

  return (
    <Container fluid>
      <Row>
        {elements}{" "}
        <ColCard plus onClick={() => showModal("notifications")}></ColCard>
      </Row>
      <NotificationModal
        selections={notifications ?? []}
        modalKey="notifications"
      ></NotificationModal>
    </Container>
  );
};
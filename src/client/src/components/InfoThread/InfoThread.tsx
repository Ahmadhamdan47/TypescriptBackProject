import dayjs from "dayjs";
import { useRef, useState } from "react";
import { Button, Card, Modal, Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import * as FaIcons from "react-icons/fa";

const demoMessages = [
  {
    id: "1",
    topic: "Permanence de samedi",
    content: "Les personnes d'astreinte samedi sont : ... ",
    sender: "Lt Col. Dupont",
    timestamp: "2021-03-02 13:19:20",
  },
  {
    id: "2",
    topic: "Cross de Noël",
    content: "Le cross de Noël aura lieu le 24 décembre à 14h.",
    sender: "CSE",
    timestamp: "2022-01-06 05:12:22",
  },
  {
    id: "3",
    topic: "Nouvelle version de l'application",
    content: "Merci à Castel pour cette super application !",
    sender: "Maintenance informatique",
    timestamp: "2023-05-09 15:49:26",
  },
];

export type displayMode = {
  mode: "compact" | "wide";
};

export default function InfoThread(mode: displayMode) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState(demoMessages);
  const messageContent = useRef<HTMLDivElement>(null);
  const displayMessage = (content: string) => () => {
    if (!messageContent.current) return;
    messageContent.current.classList.remove("text-muted");
    messageContent.current.innerHTML = content;
  };

  // New message modal management
  const [showModal, setShowModal] = useState(false);
  const newMessageTopic = useRef<HTMLInputElement>(null);
  const newMessageContent = useRef<HTMLTextAreaElement>(null);

  const addNewMessage = (message: (typeof demoMessages)[0]) => {
    setMessages(prev => [...prev, message]);
    setShowModal(false);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    if (!newMessageTopic.current || !newMessageContent.current) return;
    newMessageTopic.current.value = "";
    newMessageContent.current.value = "";
  };
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <Card className="bg-light h-100 w-100">
        <Card.Header>Group Name</Card.Header>
        <Card.Body className="d-flex flex-column">
          <Card.Title>{t("info-thread.messagesList.title")}</Card.Title>
          <Table className="table-sm table-hover mb-auto">
            <thead>
              <tr>
                <th>{t("info-thread.messagesList.messageTopic")}</th>
                <th>{t("info-thread.messagesList.messageDate")}</th>
                <th>{t("info-thread.messagesList.messageSender")}</th>
                <th>{t("info-thread.messagesList.messageStatus.title")}</th>
                <th>{t("info-thread.messagesList.messageActions")}</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(message => (
                <tr key={message.id} onClick={displayMessage(message.content)}>
                  <td>{message.topic}</td>
                  <td>{message.timestamp}</td>
                  <td>{message.sender}</td>
                  <td>{t("info-thread.messagesList.messageStatus.read")}</td>
                  <td>
                    <FaIcons.FaEdit /> <FaIcons.FaCopy /> <FaIcons.FaTrash />{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="border border-secondary rounded">
            <div className="p-2">
              <div ref={messageContent} className="text-muted">
                {t("info-thread.messageContentPlaceholder")}
              </div>
              <div className="d-flex justify-content-end me-2 mb-2">
                {mode.mode === "compact" && (
                  <Button
                    variant="outline-castel"
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                    onClick={handleShowModal}
                  >
                    <FaIcons.FaPlus />
                  </Button>
                )}
                {mode.mode === "wide" && (
                  <Button variant="outline-castel" onClick={handleShowModal}>
                    <FaIcons.FaPlus />
                    <span className="ms-2">{t("buttons.newMessage")}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("info-thread.new")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="message-topic" className="form-label">
              {t("info-thread.messagesList.messageTopic")}
            </label>
            <input
              type="text"
              className="form-control"
              ref={newMessageTopic}
              placeholder={
                t("info-thread.messagesList.messageTopicPlaceholder") ??
                "Enter a topic"
              }
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message-content" className="form-label">
              {t("info-thread.messagesList.messageContent")}
            </label>
            <textarea
              className="form-control"
              ref={newMessageContent}
              placeholder={
                t("info-thread.messagesList.messageContentPlaceholder") ??
                "Enter a message"
              }
              style={{ height: "100px" }}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="castel"
            onClick={() =>
              addNewMessage({
                id: Math.random().toString(),
                topic: newMessageTopic.current?.value ?? "",
                content: newMessageContent.current?.value ?? "",
                sender: "demo",
                timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss").toString(),
              })
            }
          >
            {t("buttons.send")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

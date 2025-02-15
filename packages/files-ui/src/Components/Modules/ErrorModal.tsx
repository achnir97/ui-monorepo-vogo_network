import React from "react"
import { Button, Modal, Typography } from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"

interface Props {
  error: Error
  componentStack: string | null
  eventId: string | null
  resetError: () => void
}

const ErrorModal = ({ error, componentStack, resetError }: Props) => {

  const generalStyle = {
    margin: "1rem",
    backgroundColor: "var(--gray1)",
    color: "var(--gray9)"
  }

  return <Modal
    active
    closePosition="none"
    onClose={resetError}
  >
    <Typography
      variant="h2"
      style={{
        marginTop: "3rem",
        display: "inline-block",
        ...generalStyle
      }}
    >
        An unexpected error occurred
    </Typography>
    <Typography
      component="p"
      style={{ ...generalStyle }}
    >
        If you would like to provide additional info to help us debug and resolve the issue, reach out on <a
        target="_blank"
        rel="noopener noreferrer"
        href={ROUTE_LINKS.DiscordInvite}
      >
        Discord
      </a>
    </Typography>
    <Typography
      variant="h4"
      style={{
        ...generalStyle,
        display: "inline-block"
      }}
    >
        Error:
    </Typography>
    <Typography
      style={{
        ...generalStyle,
        backgroundColor: "ghostwhite",
        padding: "1rem",
        marginTop: 0,
        color: "black",
        maxHeight: "8rem",
        overflow: "auto"
      }}
      component="p"
    >
      {error?.message.toString()}
    </Typography>
    <Typography
      variant="h4"
      style={{
        ...generalStyle,
        display: "inline-block"
      }}
    >
        Stack:
    </Typography>
    <Typography
      component="p"
      style={{
        ...generalStyle,
        height: "10rem",
        overflow: "auto",
        padding: "1rem",
        border: "2px solid ghostwhite",
        marginTop: 0
      }}
    >
      {componentStack}
    </Typography>
    <div
      style={{
        ...generalStyle,
        display: "flex",
        justifyContent: "center"

      }}
    >
      <Button onClick={resetError}>
        Close
      </Button>
    </div>
  </Modal>
}

export default ErrorModal
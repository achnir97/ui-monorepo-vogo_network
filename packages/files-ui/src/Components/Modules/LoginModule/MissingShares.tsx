import React, { ChangeEvent, useCallback, useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, TextInput, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) =>
  createStyles({
    content:{
      width: 580,
      padding: `0 ${constants.generalUnit * 14}px`,
      [breakpoints.down("md")]: {
        width: "100%",
        padding: `0 ${constants.generalUnit * 2.75}px`
      }
    },
    buttonSection: {
      [breakpoints.up("md")]: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      },
      [breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly"
      }
    },
    button: {
      width: `calc(100% - ${constants.generalUnit * 8}px)`,
      marginLeft: constants.generalUnit * 4,
      marginRight: constants.generalUnit * 4,
      marginBottom: constants.generalUnit * 2
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: constants.generalUnit * 4,
      marginBottom: constants.generalUnit * 4
    },
    headerText: {
      textAlign: "center",
      [breakpoints.up("md")]: {
        paddingTop: constants.generalUnit * 4,
        paddingBottom: constants.generalUnit * 8
      },
      [breakpoints.down("md")]: {
        paddingTop: constants.generalUnit * 3,
        paddingBottom: constants.generalUnit * 3,
        textAlign: "center"
      }
    },
    text: {
      display: "inline-block",
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4,
      textAlign: "center",
      [breakpoints.down("md")]: {
        paddingLeft: 0,
        paddingRight: 0,
        "&.label": {
          paddingLeft: constants.generalUnit * 4
        }
      }
    },
    footer: {
      textAlign: "center",
      marginTop: constants.generalUnit * 2,
      padding: `${constants.generalUnit * 2.5}px ${constants.generalUnit * 1.5}px`,
      width: "100%"
    },
    buttonLink: {
      color: palette.additional["gray"][10],
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer"
    },
    textInput:{
      width: "100%",
      margin: 0,
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4
    },
    belowInput: {
      margin: "auto",
      marginTop: constants.generalUnit * 4
    },
    textAreaContainer: {
      marginTop: constants.generalUnit,
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4,
      "& > textarea" : {
        width: "100%",
        height: constants.generalUnit * 10,
        padding: constants.generalUnit
      }
    },
    error: {
      display: "inline-block",
      padding: constants.generalUnit * 4
    }
  }))


interface IMissingShares {
  className?: string
}

const MissingShares = ({ className }: IMissingShares) => {
  const { inputPasswordShare, inputMnemonicShare, hasPasswordShare } = useThresholdKey()
  const [password, setPassword] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [withMnemonic, setWithMnemonic] = useState(false)
  const [withPassword, setWithPassword] = useState(false)
  const classes = useStyles()
  const { logout } = useThresholdKey()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password) return
    setIsLoading(true)

    inputPasswordShare(password)
      .catch((e) => {
        setIsLoading(false)
        setError(t`Password does not match user account, please double-check and try again.`)
        console.error("error upon password input", e)
      })
  }

  const handleSubmitMnemonicShare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!mnemonic) return
    setIsLoading(true)

    inputMnemonicShare(mnemonic)
      .catch(() => {
        setIsLoading(false)
        setError(t`Backup secret phrase does not match user account, please double-check and try again.`)
      })
  }

  const onPasswordChange = useCallback((password: string | number | undefined) => {
    setError("")
    setPassword(password?.toString() || "")
  }, [])

  const onMnemonicChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setError("")
    setMnemonic(event.currentTarget.value)
  }, [])

  const onResetMethod = useCallback(() => {
    setError("")
    setMnemonic("")
    setPassword("")
    setWithMnemonic(false)
    setWithPassword(false)
  }, [])

  return (
    <div className={className}>
      <div className={classes.content}>
        <Typography
          variant="h6"
          component="h1"
          className={classes.headerText}
        >
          <Trans>Sign in</Trans>
        </Typography>
        { !withMnemonic && !withPassword && (
          <>
            <Typography className={classes.text}>
              <Trans>
                Looks like you’re signing in from a new browser.
                Please choose one of the following to continue:
              </Trans>
            </Typography>
            <div className={classes.buttonWrapper}>
              {hasPasswordShare && (
                <Button
                  data-cy="button-login-password"
                  className={classes.button}
                  variant="primary"
                  size="large"
                  onClick={() => setWithPassword(true)}
                >
                  <Trans>Enter password</Trans>
                </Button>
              )}
              <Button
                className={classes.button}
                variant="primary"
                size="large"
                onClick={() => setWithMnemonic(true)}
              >
                <Trans>Restore with backup secret phrase</Trans>
              </Button>
            </div>
            <Typography className={classes.text}>
              <Trans>
                Or confirm by signing into your Files on any
                browser you’ve used before.
              </Trans>
            </Typography>
          </>
        )}
        {withPassword && (
          <form onSubmit={handleSubmitPassword}>
            <Typography className={clsx(classes.text, "label")}>
              <Trans>Enter password:</Trans>
            </Typography>
            <TextInput
              data-cy="input-login-password"
              autoFocus
              className={classes.textInput}
              value={password}
              onChange={onPasswordChange}
              type={"password"}
            />
            <Button
              variant="primary"
              type='submit'
              className={clsx(classes.button, classes.belowInput)}
              size="large"
              loading={isLoading}
              disabled={!!error || isLoading}
            >
              <Trans>Continue</Trans>
            </Button>
            <Typography className={classes.error}>
              {error}
            </Typography>
          </form>
        )}
        {withMnemonic && (
          <form onSubmit={handleSubmitMnemonicShare}>
            <Typography className={clsx(classes.text, "label")}>
              <Trans>Enter backup secret phrase:</Trans>
            </Typography>
            <div className={classes.textAreaContainer}>
              <textarea
                autoFocus
                value={mnemonic}
                onChange={onMnemonicChange}
              />
            </div>
            <Button
              variant="primary"
              type='submit'
              className={clsx(classes.button, classes.belowInput)}
              size="large"
              loading={isLoading}
              disabled={!!error || isLoading}
            >
              <Trans>Continue</Trans>
            </Button>
            <Typography className={classes.error}>
              {error}
            </Typography>
          </form>
        )}
      </div>
      <footer className={classes.footer}>
        { !withMnemonic && !withPassword && !isLoading && (
          <div
            className={classes.buttonLink}
            onClick={logout}
          >
            <Typography>
              <Trans>
                Sign in with a different account
              </Trans>
            </Typography>
          </div>
        )}
        { (withMnemonic || withPassword) && !isLoading && (
          <div
            className={classes.buttonLink}
            onClick={onResetMethod}
          >
            <Typography>
              <Trans>
                Try another method
              </Trans>
            </Typography>
          </div>
        )}
      </footer>
    </div>
  )
}

export default MissingShares

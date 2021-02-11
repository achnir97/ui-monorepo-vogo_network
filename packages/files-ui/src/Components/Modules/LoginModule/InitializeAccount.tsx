import React, { useState, useEffect } from "react"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import {
  Button,
  CheckboxInput,
  TextInput,
  Typography,
} from "@chainsafe/common-components"

const InitializeAccount: React.FC = () => {
  const {
    keyDetails,
    addPasswordShare,
    isNewKey,
    addMnemonicShare,
    enableSkipMinThreshold,
  } = useThresholdKey()
  const [password, setPassword] = useState<string | undefined>("")
  const [dismissNewKey, setDismissNewKey] = useState(false)
  const [mnemonic, setMnemonic] = useState("")

  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
        return JSON.parse(share[0])
      })
    : []

  const hasPasswordShare =
    shares.filter((s) => s.module === "securityQuestions").length > 0

  const hasMnemonicShare =
    shares.filter((s) => s.module === "securityQuestions").length > 0

  const handleSetPassword = async () => {
    if (!password) return
    await addPasswordShare(password)
  }

  const handleSetMnemonic = async () => {
    const newMnemonic = await addMnemonicShare()
    setMnemonic(newMnemonic)
  }

  return (
    <div>
      {isNewKey && !dismissNewKey ? (
        <>
          <Typography variant="h5">This is a new account</Typography>
          <Typography>Lorem ipsum setup info</Typography>
          <Button onClick={() => setDismissNewKey(true)}>Lets go</Button>
        </>
      ) : (
        <>
          <Typography variant="h5">Min number of shares</Typography>
          <Typography>
            Add more shares to ensure you dont get locked out of your account
          </Typography>
          {!hasPasswordShare && (
            <div>
              <label>Enter you account password:</label>
              <TextInput
                value={password}
                onChange={(val) => setPassword(val?.toString())}
              />
              <Button onClick={handleSetPassword}>Submit</Button>
            </div>
          )}
          {!hasMnemonicShare && (
            <div>
              <Button onClick={handleSetMnemonic} disabled={!!mnemonic}>
                Generate mnemonic
              </Button>
              {mnemonic && <span>{mnemonic}</span>}
            </div>
          )}
          <Button onClick={enableSkipMinThreshold}>Skip for now</Button>
        </>
      )}
    </div>
  )
}

export default InitializeAccount

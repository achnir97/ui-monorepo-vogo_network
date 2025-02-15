import React from "react"
import { usePageTrack } from "../../Contexts/PosthogContext"
import SearchFileBrowser from "../Modules/FileBrowsers/SearchFileBrowser"
import { Helmet } from "react-helmet-async"
import { t } from "@lingui/macro"

const SearchPage = () => {
  usePageTrack()

  return <>
    <Helmet>
      <title>{t`Search results`} - Chainsafe Files</title>
    </Helmet>
    <SearchFileBrowser />
  </>
}

export default SearchPage

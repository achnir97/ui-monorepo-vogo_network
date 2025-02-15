import { Crumb } from "@chainsafe/common-components"
import React, { useContext } from "react"
import { FileOperation, IBulkOperations, IFileBrowserModuleProps } from "./types"
import { Bucket, FileSystemType } from "@chainsafe/files-api-client"
import { FileSystemItem } from "./StorageContext"

export interface ISelectedFile {
  cid: string
  name: string
}

interface FileBrowserContext extends IFileBrowserModuleProps {
  bucket?: Bucket
  itemOperations: {[contentType: string]: FileOperation[]}
  bulkOperations?: IBulkOperations
  renameItem?: (item: ISelectedFile, newName: string) => Promise<void>
  moveItems?: (toMove: ISelectedFile[], newPath: string) => Promise<void>
  downloadFile?: (toDownload: ISelectedFile) => Promise<void>
  deleteItems?: (toDelete: ISelectedFile[]) => Promise<void>
  recoverItems?: (toRecover: ISelectedFile[], newPath: string) => Promise<void>
  viewFolder?: (cid: ISelectedFile) => void
  allowDropUpload?: boolean

  handleUploadOnDrop?: (
    files: File[],
    fileItems: DataTransferItemList,
    path: string,
  ) => void

  refreshContents?: () => void
  currentPath: string
  loadingCurrentPath: boolean
  sourceFiles: FileSystemItem[]
  crumbs?: Crumb[]
  moduleRootPath?: string
  getPath?: (cid: string) => string
  isSearch?: boolean
  withSurvey?: boolean
  fileSystemType?: FileSystemType
}

const FileBrowserContext = React.createContext<FileBrowserContext | undefined>(undefined)

const useFileBrowser = () => {
  const context = useContext(FileBrowserContext)
  if (context === undefined) {
    throw new Error("useFileBrowserContext must be called within a FileBrowserProvider")
  }
  return context
}

export { FileBrowserContext, useFileBrowser }

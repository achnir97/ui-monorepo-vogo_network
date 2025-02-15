import React, { useCallback, useState, useEffect, ReactNode } from "react"
import { useField } from "formik"
import { useDropzone, DropzoneOptions, FileRejection, FileWithPath } from "react-dropzone"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"
import { Button } from "../Button"
import { Typography } from "../Typography"
import { PlusIcon, CrossIcon } from "../Icons"
import { ScrollbarWrapper } from "../ScrollbarWrapper"
import { getFilesAndEmptyDirFromDataTransferItems } from "../utils"

const useStyles = makeStyles(({ constants, palette, overrides }: ITheme) =>
  createStyles({
    root: {
      paddingTop: constants.generalUnit,
      "& > div": {
        "&:first-child": {
          padding: constants.generalUnit,
          margin: `${constants.generalUnit * 4}px`
        },
        "&.scrollbar": {
          maxHeight: "80vh",
          marginTop: 0,
          marginBottom: 0
        }
      },
      marginBottom: "0 !important",
      outline: "none",
      ...overrides?.FileInput?.root
    },
    pending: {
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: palette.additional["gray"][8],
      padding: `${constants.generalUnit * 4}px 0 !important`,
      "& svg": {
        fill: palette.additional["gray"][8]
      },
      "& > *:first-child": {
        marginBottom: constants.generalUnit
      },
      ...overrides?.FileInput?.pending
    },
    filesDropped: {
      "& > div": {
        textAlign: "start"
      },
      ...overrides?.FileInput?.filesDropped
    },
    error: {
      color: palette.error.main,
      backgroundColor: palette.additional["gray"][3],
      padding: "4px 40px",
      ...overrides?.FileInput?.error
    },
    item: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      "& svg": {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        margin: 0
      },
      "& > *:first-child": {
        marginRight: constants.generalUnit
      },
      ...overrides?.FileInput?.item
    },
    itemText: {
      flex: "1 1 0"
    },
    crossIcon: {
      backgroundColor: "transparent",
      "& > span": {
        position: "relative"
      }
    },
    addFiles: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      margin: 0,
      marginTop: constants.generalUnit * 2,
      paddingTop: constants.generalUnit,
      paddingLeft: constants.generalUnit * 5,
      paddingRight: constants.generalUnit,
      paddingBottom: constants.generalUnit,
      cursor: "pointer",
      backgroundColor: palette.additional["gray"][2]
    },
    addFilesText: {
      marginLeft: constants.generalUnit
    }
  })
)

interface IFileInputProps extends DropzoneOptions {
  className?: string
  variant?: "dropzone" | "filepicker"
  name: string
  label: string
  showPreviews?: boolean
  pending?: ReactNode | ReactNode[]
  maxFileSize?: number
  classNames?: {
    pending?: string
    filelist?: string
    item?: string
    addFiles?: string
    closeIcon?: string
    error?: string
  }
  onFileNumberChange?: (filesNumber: number) => void
  onEmptyFolderPathsChange?: (emptyFolderPaths: string[]) => void
  moreFilesLabel: string
  testId?: string
}

interface FileItemProps {
  index?: number
  fullPath: string
  removeItem: (index: number) => void
  itemClassName?: string
  closeIconClassName?: string
}

const FileItem = ({ index = 0, fullPath, removeItem, itemClassName, closeIconClassName }: FileItemProps) => {
  const classes = useStyles()
  return <li
    className={clsx(classes.item, itemClassName)}
    key={index}
  >
    <span className={classes.itemText}>{fullPath}</span>
    <Button
      testId="remove-from-file-list"
      className={clsx(classes.crossIcon, closeIconClassName)}
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        removeItem(index)
      }}
      size="small"
    >
      <CrossIcon fontSize="small" />
    </Button>
  </li>
}

const FileInput = ({
  className,
  variant = "dropzone",
  showPreviews = false,
  name,
  label,
  pending,
  maxFileSize,
  classNames,
  onFileNumberChange,
  onEmptyFolderPathsChange,
  moreFilesLabel,
  testId,
  ...props
}: IFileInputProps) => {
  const classes = useStyles()
  const [previews, setPreviews] = useState<any[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [{ value }, meta, helpers] = useField<FileWithPath[] | FileWithPath | null>(name)

  useEffect(() => {
    if(Array.isArray(value)){
      onFileNumberChange && onFileNumberChange(value.length)
    } else {
      onFileNumberChange && onFileNumberChange(value ? 1 : 0)
    }
  }, [onFileNumberChange, value])

  useEffect(() => {
    // reset the field on load
    helpers.setValue([])
  // needed to avoid an infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[], fileRejections: FileRejection[]) => {
      const filtered = acceptedFiles.filter((file) =>
        maxFileSize ? file.size <= maxFileSize : true
      )

      setErrors([])
      if (showPreviews) {
        setPreviews(
          filtered.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        )
      }
      Array.isArray(value)
        ? helpers.setValue([...value, ...filtered])
        : helpers.setValue(filtered[0])

      if (fileRejections.length > 0) {
        const fileDropRejectionErrors = fileRejections.map((fr) =>
          fr.errors.map((fre) => fre.message)
        )
        setErrors(errors.concat(fileDropRejectionErrors))
      }
    },
    [errors, helpers, maxFileSize, showPreviews, value]
  )

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    previews.forEach((preview) => URL.revokeObjectURL(preview.preview))
  }, [previews])

  const dropZoneProps = {
    noDrag: variant === "filepicker",
    noClick: variant === "filepicker",
    noKeyboard: variant === "filepicker",
    ...props
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    ...dropZoneProps,
    getFilesFromEvent
  })

  async function getFilesFromEvent(event: any) {
    // this is a drag n drop
    // we support folder upload and empty folders
    if(event.dataTransfer){
      const res = await getFilesAndEmptyDirFromDataTransferItems(event.dataTransfer.items)
      onEmptyFolderPathsChange && res.emptyDirPaths?.length && onEmptyFolderPathsChange(res.emptyDirPaths)
      return res.files as File[] || []
    } else {
      // this is a file list using the input
      return event.target.files as File[]
    }
  }

  const removeItem = useCallback((i: number) => {
    let items = value

    Array.isArray(items)
      ? items.splice(i, 1)
      : items = null
    helpers.setValue(items)
  }, [helpers, value])

  return (
    <div
      {...getRootProps()}
      data-testid={`input-file-dropzone-${testId}`}
      className={clsx(classes.root, className)}
    >
      <input {...getInputProps()} />
      {variant === "dropzone" ? (
        value === null || (Array.isArray(value) && value.length === 0) ? (
          <div className={clsx(classes.pending, classNames?.pending)}>
            {pending || (
              <>
                <PlusIcon
                  fontSize="large"
                  color="primary"
                />
                <Typography>{label}</Typography>
              </>
            )}
          </div>
        ) : (
          <div
            data-testid={`list-${testId}`}
            className={clsx(classes.root, classNames?.filelist)}
          >
            <ScrollbarWrapper className="scrollbar">
              <ul>
                {Array.isArray(value)
                  ? value.map((file, i) => (
                    <FileItem
                      key={i}
                      index={i}
                      fullPath={`${file.path || ""}${file.name}`}
                      removeItem={removeItem}
                      closeIconClassName={classNames?.closeIcon}
                      itemClassName={classNames?.item}
                    />
                  ))
                  : <FileItem
                    fullPath={`${value.path || ""}${value.name}`}
                    removeItem={removeItem}
                    closeIconClassName={classNames?.closeIcon}
                    itemClassName={classNames?.item}
                  />
                }
              </ul>
            </ScrollbarWrapper>
          </div>
        )
      ) : (
        <>
          {value === null || (Array.isArray(value) && value?.length === 0)
            ? "No files selected"
            : `${Array.isArray(value) ? value?.length : 1} file(s) selected`}
          <Button
            onClick={open}
            size="small"
          >
            Select
          </Button>
        </>
      )}
      {Array.isArray(value) && value.length > 0 && (
        <div
          className={clsx(classes.addFiles, classNames?.addFiles)}
        >
          <PlusIcon
            fontSize="small"
            color="primary"
          />
          <span className={classes.addFilesText}>{moreFilesLabel}</span>
        </div>
      )}
      {(meta.error || errors.length > 0) && (
        <ul className={classNames?.error}>
          <li
            data-testid={`meta-error-message-${testId}`}
            className={classes.error}
          >
            {meta.error}
          </li>
          {errors.map((error, i) => (
            <li
              key={i}
              className={classes.error}
              data-testid={`error-message-${testId}`}
            >
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileInput

export { IFileInputProps }

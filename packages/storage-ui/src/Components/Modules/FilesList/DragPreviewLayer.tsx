import { FolderFilledSvg, FileImageSvg, FilePdfSvg, FileTextSvg, Typography } from "@chainsafe/common-components"
import {  makeStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import React from "react"
import { useDragLayer, XYCoord } from "react-dnd"
import { FileSystemItem } from "../../../Contexts/StorageContext"
import { CSSTheme } from "../../../Themes/types"
import { DragTypes } from "./DragConstants"
import { BrowserView } from "../../../Contexts/types"
import { ISelectedFile } from "../../../Contexts/FileBrowserContext"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSSTheme) => {
  return ({
    rowItem: {
      display: "flex",
      height: 70,
      border: "2px solid transparent"
    },
    fileIcon: {
      "& svg": {
        width: constants.generalUnit * 2.5,
        fill: constants.fileSystemItemRow.icon
      },
      [breakpoints.up("md")]: {
        paddingLeft: constants.generalUnit * 8.5
      },
      paddingRight: constants.generalUnit * 6
    },
    folderIcon: {
      "& svg": {
        fill: palette.additional.gray[9]
      }
    },
    filename: {
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden"
    },
    previewDragLayer: {
      position: "fixed",
      pointerEvents: "none",
      zIndex: 10000,
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    gridViewContainer: {
      display: "flex",
      flex: 1,
      maxWidth: constants.generalUnit * 24
    },
    gridFolderName: {
      textAlign: "center",
      wordBreak: "break-all",
      overflowWrap: "break-word",
      padding: constants.generalUnit
    },
    gridViewIconNameBox: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      cursor: "pointer"
    },
    gridIcon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: constants.generalUnit * 16,
      maxWidth: constants.generalUnit * 24,
      border: `1px solid ${palette.additional["gray"][6]}`,
      boxShadow: constants.filesTable.gridItemShadow,
      "& svg": {
        width: "30%"
      },
      [breakpoints.down("lg")]: {
        height: constants.generalUnit * 16
      },
      [breakpoints.down("sm")]: {
        height: constants.generalUnit * 16
      }
    },
    menuTitleGrid: {
      padding: `0 ${constants.generalUnit * 0.5}px`,
      [breakpoints.down("md")]: {
        padding: 0
      }
    }
  })})

const DragPreviewRowItem: React.FC<{item: FileSystemItem; icon: React.ReactNode}> = ({
  item: { name, isFolder },
  icon
}) => {
  const classes = useStyles()
  return (
    <div className={classes.rowItem}>
      <div className={clsx(classes.fileIcon, isFolder && classes.folderIcon)}>
        {icon}
      </div>
      <div className={classes.filename}>
        <Typography>{name}</Typography>
      </div>
    </div>
  )
}

const DragPreviewGridItem: React.FC<{item: FileSystemItem; icon: React.ReactNode}> = ({
  item: { name, isFolder },
  icon
}) => {
  const classes = useStyles()
  return (
    <div className={classes.gridViewContainer}>
      <div
        className={clsx(classes.gridViewIconNameBox)}
      >
        <div
          className={clsx(
            classes.fileIcon,
            isFolder && classes.folderIcon,
            classes.gridIcon
          )}
        >
          {icon}
        </div>
        <div className={classes.gridFolderName}>{name}</div>
      </div>
    </div>
  )
}

export const DragPreviewLayer: React.FC<{items: FileSystemItem[]; previewType: BrowserView} > = ({ items, previewType }) => {
  const classes = useStyles()
  const { isDragging, dragItems, itemType, currentOffset } = useDragLayer(monitor => ({
    itemType: monitor.getItemType(),
    dragItems: monitor.getItem() as {selected: ISelectedFile[]},
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset()
  }))

  const getItemStyles = (currentOffset: XYCoord | null) => {
    if (!currentOffset) {
      return {
        display: "none"
      }
    }
    const { x, y } = currentOffset

    const transform = `translate(${x}px, ${y}px)`
    return {
      transform,
      WebkitTransform: transform
    }
  }

  return (!isDragging || itemType !== DragTypes.MOVABLE_FILE)
    ? null
    : <div className={classes.previewDragLayer}>
      <ul style={getItemStyles(currentOffset)}>
        {dragItems.selected.map(di => {
          const previewItem = items.find(i => i.cid === di.cid && i.name === di.name)

          if (previewItem) {
            let Icon
            if (previewItem.isFolder) {
              Icon = FolderFilledSvg
            } else if (previewItem.content_type.includes("image")) {
              Icon = FileImageSvg
            } else if (previewItem.content_type.includes("pdf")) {
              Icon = FilePdfSvg
            } else {
              Icon = FileTextSvg
            }

            return (previewType === "table")
              ? <DragPreviewRowItem
                item={previewItem}
                icon={<Icon />}
                key={`${previewItem.cid}_${previewItem.name}`}
              />
              : <DragPreviewGridItem
                item={previewItem}
                icon={<Icon />}
                key={`${previewItem.cid}_${previewItem.name}`}
              />
          } else {
            return null
          }})}
      </ul>
    </div>
}

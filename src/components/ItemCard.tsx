import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import React from "react";
import { rarities } from "../anno-config";
import type { AnnoItem } from "../types";

const raritiesByKey = rarities.reduce((all: Record<string, string>, r) => ({ ...all, [r.key]: r.color }), {});

const CustomCard = styled(Card)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  borderWidth: 2,
  borderStyle: "solid",
});

const CustomCardContent = styled(CardContent)({
  maxHeight: "12rem",
  overflow: "auto",
  paddingTop: "0",
  marginBottom: "auto",
});

interface ItemCardProps extends React.PropsWithChildren {
  item: AnnoItem;
  titleSuffix?: React.ReactNode;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, titleSuffix, children }) => (
  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} sx={{ display: "flex" }}>
    <CustomCard elevation={3} sx={{ borderColor: raritiesByKey[item.rarity?.toLowerCase()] }}>
      <CardHeader
        avatar={<img src={item.icon} width={35} height={35} />}
        title={
          <>
            <strong>{item.name}</strong>
            {titleSuffix || null}
          </>
        }
        slotProps={{ title: { variant: "body1" } }}
        subheader={
          <>
            <Box component="span" sx={{ color: raritiesByKey[item.rarity?.toLowerCase()] }}>
              {item.rarity}&nbsp;
            </Box>
            (ID: {item.id})
          </>
        }
      />
      <CustomCardContent>{children}</CustomCardContent>
    </CustomCard>
  </Grid>
);

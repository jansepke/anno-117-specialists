import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { AnnoItem } from "../types";
import ItemCard from "./ItemCard";
import VirtualizedList from "./shared/VirtualizedList";

interface ItemListProps {
  items: AnnoItem[];
}

const ItemList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <Container maxWidth="xl">
      <br />
      <Typography align="right">
        {items.length !== items.length ? `${items.length}/` : ""}
        {items.length} Items
      </Typography>
      <br />
      <Grid container spacing={3}>
        <VirtualizedList
          items={items}
          renderItem={(item) => <ItemCard key={item.id} item={item} />}
          loadingIndicator={(ref, visible) => (
            <Grid size={{ xs: 12 }} ref={ref}>
              <Grid container justifyContent="center">
                {visible ? <CircularProgress /> : null}
              </Grid>
            </Grid>
          )}
        />
      </Grid>
    </Container>
  );
};

export default ItemList;

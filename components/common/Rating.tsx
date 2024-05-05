import { Flex, Text } from "@radix-ui/themes";
import { Rating as MuiRating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

interface RatingProps {
  rating: number;
  ratingCount?: number;
  icon?: React.ReactNode;
}
const Rating = ({ rating, ratingCount, icon }: RatingProps) => {
  if (rating <= 0) return <></>;
  return (
    <Flex direction="row" justify="start" align="center" gapX="2">
      <MuiRating
        readOnly
        size="small"
        name="product rating"
        defaultValue={rating}
        precision={0.5}
        icon={
          icon || <StarIcon fontSize="small" className="text-yellow-400 dark:text-yellow-500" />
        }
        emptyIcon={icon || <StarIcon fontSize="small" className="text-gray-400 opacity-20" />}
        className="z-50 cursor-pointer"
      />
      {ratingCount && <Text className="text-muted-foreground">{ratingCount} ratings</Text>}
    </Flex>
  );
};

export default Rating;

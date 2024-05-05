import { Flex, Text } from "@radix-ui/themes";
import { Rating as MuiRating, RatingProps } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { Dispatch, ReactNode, SetStateAction } from "react";

interface Props extends RatingProps {
  ratingCount?: number;
  rating: number;
  setRateing?: Dispatch<SetStateAction<number>>;
}
const Rating = ({
  rating,
  ratingCount,
  icon,
  emptyIcon,
  readOnly = true,
  setRateing,
  precision,
}: Props) => {
  return (
    <Flex direction="row" justify="start" align="center" gapX="2">
      <MuiRating
        readOnly={readOnly}
        size="small"
        name="rating"
        defaultValue={setRateing ? undefined : rating}
        precision={precision || 0.5}
        icon={
          icon || <StarIcon fontSize="small" className="text-yellow-400 dark:text-yellow-500" />
        }
        emptyIcon={emptyIcon || <StarIcon fontSize="small" className="text-gray-400 opacity-20" />}
        className="z-50 cursor-pointer"
        value={setRateing ? rating : undefined}
        onChange={(event, newValue) => newValue && setRateing && setRateing(newValue)}
      />
      {ratingCount && <Text className="text-muted-foreground">{ratingCount} ratings</Text>}
    </Flex>
  );
};

export default Rating;

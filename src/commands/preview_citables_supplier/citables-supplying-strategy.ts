import Citable from "../../models/citable";

interface CitableSupplyingStategy {
  provideCitables(): Promise<Array<Citable>>;
}

export default CitableSupplyingStategy;
export interface PlaceData {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  google_place_id?: string;
  google_maps_url?: string;
}

export interface PlaceListData {
  list_name: string;
  owner?: string;
  places: PlaceData[];
}

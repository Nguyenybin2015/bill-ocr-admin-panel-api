export type OrderPriceInfo = { total_price: number; total_temp_price: number };

export type ObjectType = {
	[key: string]: any; // Recursive definition to represent nested objects
};

export type MetaObjectType = ObjectType & { remaining_quantity?: number };

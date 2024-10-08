import { OrderedPart } from "@/types";
import { supabase_client } from "./SupabaseClient";
import toast from "react-hot-toast";

export const fetchOrderedPartByPartID = async( part_id:number) => {
    const {data,error} =  await supabase_client.from('order_parts').select(
        `
        id,
        is_sample_received_by_office,
        is_sample_sent_to_office,
        part_sent_by_office_date,
        part_received_by_factory_date,
        part_purchased_date,
        qty,
        vendor,
        brand, 
        unit_cost,
        note,
        office_note,
        in_storage,
        approved_storage_withdrawal,
        order_id,
        part_id,
        approved_pending_order,
        approved_office_order,
        approved_budget,
        orders(*),
        parts(*)
        `
    ).eq('part_id',part_id).order('id', { ascending: true });

    console.log(data)
    if(error) {
        toast.error(error.message)
    }
    return data as unknown as OrderedPart[]

}

export const fetchOrderedPartsByOrderID = async (order_id: number)=> {
    const {data,error} =  await supabase_client.from('order_parts').select(
        `
        id,
        is_sample_received_by_office,
        is_sample_sent_to_office,
        part_sent_by_office_date,
        part_received_by_factory_date,
        part_purchased_date,
        qty,
        vendor,
        brand, 
        unit_cost,
        note,
        office_note,
        in_storage,
        approved_storage_withdrawal,
        order_id,
        part_id,
        approved_pending_order,
        approved_office_order,
        approved_budget,
        orders(*),
        parts(*)
        `
    ).eq('order_id',order_id).order('id', { ascending: true });
    console.log(data)
    if(error) {
        toast.error(error.message)
    }
    return data as unknown as OrderedPart[]
}

export const fetchLastCostAndPurchaseDate = async (machine_id: number, part_id: number) => {
    const { data, error } = await supabase_client
    .from('order_parts')
    .select(`
      unit_cost, 
      part_purchased_date,
      part_id,
      orders(machine_id)
    `)
    .eq('orders.machine_id', machine_id)
    .eq('part_id', part_id)
    .not('part_purchased_date', 'is', null)
    .order('part_purchased_date', {ascending:false})
    .limit(1)

    if (error) {
        toast.error(error.message);
        return null; 
    }
    if (data && data.length > 0) {
        const mostRecent = data[0];
        console.log(data);
        return {
            unit_cost: mostRecent.unit_cost,
            part_purchase_date: mostRecent.part_purchased_date
        };
    } else {
        console.log(data)
        return null;
    }
};

export const updateOfficeNoteByID = async(orderedpart_id: number, updated_note: string) => {
    const {error} =  await supabase_client.from('order_parts').update(
        {office_note: updated_note}
    ).eq('id',orderedpart_id)

    if (error) {
        toast.error(error.message)
    }
}

export const updateApprovedOfficeOrderByID = async (orderedpart_id: number, approved: boolean) => {
        
    const { error } = await supabase_client.from('order_parts').update(
        { approved_office_order: approved }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateApprovedStorageWithdrawalByID = async (orderedpart_id: number, approved: boolean) => {
        
    const { error } = await supabase_client.from('order_parts').update(
        { approved_storage_withdrawal: approved }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateApprovedBudgetByID = async (orderedpart_id: number, approved:boolean) => {
    const { error } = await supabase_client.from('order_parts').update(
        { approved_budget: approved }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateApprovedPendingOrderByID = async (orderedpart_id:number, approved:boolean) => {
    const { error } = await supabase_client.from('order_parts').update(
        { approved_pending_order: approved }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const deleteOrderedPartByID = async (orderedpart_id: number) => {
    
    const { error } = await supabase_client.from('order_parts').delete()
    .eq('id', orderedpart_id)

    if (error){
        toast.error(error.message)
    }
        
}

export const updateCostingByID = async (orderedpart_id: number, brand:string | null, unit_cost: number | null, vendor: string | null) => {
    const { error } = await supabase_client.from('order_parts').update(
        { 
            brand: brand,
            vendor: vendor,
            unit_cost: unit_cost
        }
    ).eq('id', orderedpart_id)

    if (error) {
        toast.error(error.message)
    }
}

export const updateSampleReceivedByID = async (orderedpart_id: number, isReceived: boolean) => {
    const { error } = await supabase_client.from('order_parts').update(
        { is_sample_received_by_office: isReceived }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updatePurchasedDateByID = async (orderedpart_id: number, purchasedDate: Date) => {
    const { error } = await supabase_client.from('order_parts').update(
        { part_purchased_date: purchasedDate }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateSentDateByID = async (orderedpart_id: number, sentDate: Date) => {
    const { error } = await supabase_client.from('order_parts').update(
        { part_sent_by_office_date: sentDate }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateReceivedByFactoryDateByID = async (orderedpart_id: number, receivedDate: Date) => {
    const { error } = await supabase_client.from('order_parts').update(
        { part_received_by_factory_date: receivedDate }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const updateOrderedPartQtyByID =  async (orderedpart_id:number, new_quantity:number) => {
    const { error } = await supabase_client.from('order_parts').update(
        { qty: new_quantity }
    ).eq('id', orderedpart_id)
    
    if (error){
        toast.error(error.message)
    }
}

export const insertOrderedParts = async (
    
    qty: number,
    order_id: number,
    part_id: number,
    is_sample_sent_to_office: boolean,
    note: string | null,
    in_storage: boolean,
    approved_storage_withdrawal: boolean
) => {

    const { data, error } = await supabase_client.from('order_parts').insert([{
        qty,
        order_id,
        part_id,
        is_sample_sent_to_office,
        note,
        in_storage,
        approved_storage_withdrawal
    }])
    .select();


    if (error) {
        toast.error("Failed to insert order part: " + error.message);
        return null;
    }

    // toast.success("Order part added successfully");
    return data as unknown as OrderedPart[];
};


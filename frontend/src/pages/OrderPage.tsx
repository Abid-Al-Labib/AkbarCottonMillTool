import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Loader2, PlusCircle, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import NavigationBar from "@/components/customui/NavigationBar";
import toast from 'react-hot-toast';
import OrdersTableRow from '@/components/customui/OrdersTableRow';
import { Order } from '@/types';
import { fetchOrders } from '@/services/OrdersService';
import { DayPicker } from 'react-day-picker';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { fetchDepartments } from '@/services/FactoriesService';
import { fetchStatuses } from '@/services/StatusesService';


interface Department {
    id: number;
    name: string;
}
interface Status {
    id: number;
    name: string;
}

const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ordersPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'id' | 'date'>('id'); // Toggle between ID and Date search
    const [tempDate, setTempDate] = useState<Date | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [count, setCount] = useState(0);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>(undefined);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);
    const selectedDepartmentName = selectedDepartmentId ? departments.find(dept => dept.id === selectedDepartmentId)?.name : "All Departments";
    const selectedStatusName = selectedStatusId ? statuses.find(status => status.id === selectedStatusId)?.name : "All Statuses";


    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


    const refreshTable = async () => {
        console.log('Refreshing table...');
        console.log('Current Department ID:', selectedDepartmentId);
        try {
            setLoading(true);
            const { data, count } = await fetchOrders({
                page: currentPage,
                limit: ordersPerPage,
                query: searchType === 'id' ? searchQuery : '',
                searchDate: searchType === 'date' ? selectedDate : undefined,
                statusId: selectedStatusId,
                departmentId: selectedDepartmentId,
            });
            setOrders(data);
            setCount(count ?? 0);
            setTotalPages(Math.ceil((count ?? 0) / ordersPerPage));
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleDateChange = () => {
        setSelectedDate(tempDate); // Set the date (undefined is fine here)
        setIsDatePickerOpen(false); // Close the date picker after selecting a date
    };

    const handleSearchTypeChange = (type: 'id' | 'date') => {
        setSearchType(type);
        setSearchQuery('');
        setSelectedDate(undefined);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (value: string) => {
        const statusId = value === 'all' ? undefined : Number(value); // Convert the selected value to a number or set to undefined for "All Statuses"
        setSelectedStatusId(statusId); // Directly set the status ID or undefined
        console.log(`Selected Status ID: ${statusId}`); // Log the correct status ID
    };

    const handleDepartmentChange = (value: string) => {
        const departmentId = value === 'all' ? undefined : Number(value); // Convert the selected value to a number or set to undefined for "All Departments"
        setSelectedDepartmentId(departmentId); // Directly set the department ID or undefined
        console.log(`Selected Department ID: ${departmentId}`); // Log the correct department ID
    };

    useEffect(() => {
        refreshTable();
    }, [currentPage, searchQuery, selectedDate]);

    useEffect(() => {
        console.log('Refreshing table with department ID:', selectedDepartmentId);
        refreshTable(); // Call refreshTable after department ID is set
    }, [selectedDepartmentId]);

    useEffect(() => {
        console.log('Refreshing table with status ID:', selectedStatusId);
        refreshTable(); // Call refreshTable after status ID is set
    }, [selectedStatusId]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const fetchedDepartments = await fetchDepartments();
                setDepartments(fetchedDepartments);
            } catch (error) {
                toast.error('Failed to load departments');
            }
        };

        loadDepartments();
    }, []);

    

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const fetchedStatuses = await fetchStatuses();
                console.log('Fetched Statuses:', fetchedStatuses); // Log the fetched departments to verify
                setStatuses(fetchedStatuses);
            } catch (error) {
                toast.error('Failed to load departments');
            }
        };

        loadStatuses();
    }, []);

    return (
        <>
            <NavigationBar />
            <div className="flex min-h-screen mt-3 w-full flex-col bg-muted/40">
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Tabs defaultValue="all">
                            <div className="flex items-center">
                                <div className="ml-auto flex items-center gap-2">

                                    {/* Department Filter */}
                                    <div className="flex flex-col">
                                        <Select
                                            value={selectedDepartmentId === undefined ? "all" : selectedDepartmentId.toString()}
                                            onValueChange={(value) => handleDepartmentChange(value)}
                                        >
                                            <SelectTrigger className="w-[220px]">
                                                <SelectValue>
                                                    {selectedDepartmentId === undefined || selectedDepartmentName === "Select Department"
                                                        ? "All Departments"
                                                        : selectedDepartmentName}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <Select
                                        value={selectedStatusId === undefined ? "all" : selectedStatusId.toString()}
                                        onValueChange={(value) => handleStatusChange(value)}
                                    >
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue>
                                                {selectedStatusId === undefined || selectedStatusName === "Select Status"
                                                    ? "All Statuses"
                                                    : selectedStatusName}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {statuses
                                                .sort((a, b) => a.id - b.id)  // Sorting statuses by id
                                                .map((status) => (
                                                    <SelectItem key={status.id} value={status.id.toString()}>
                                                        {status.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Search by ID and Date */}
                                    <div className="flex gap-4">
                                        <Button
                                            variant={searchType === 'id' ? 'default' : 'outline'}
                                            onClick={() => handleSearchTypeChange('id')}
                                        >
                                            Search by ID
                                        </Button>
                                        <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant={searchType === 'date' ? 'default' : 'outline'}
                                                    onClick={() => handleSearchTypeChange('date')}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    Search by Date
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] p-6 rounded-lg bg-white shadow-lg">
                                                <DialogTitle className="text-lg font-semibold mb-4">Select Date</DialogTitle>
                                                <Calendar
                                                    mode="single"
                                                    selected={tempDate}
                                                    onSelect={setTempDate}
                                                    className="rounded-md border"
                                                />
                                                <div className="flex justify-end mt-4">
                                                    <Button
                                                        onClick={() => {
                                                            handleDateChange();
                                                        }}
                                                        className="bg-blue-950 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Confirm
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    {/* Search by ID Input */}
                                    <div className="relative ml-auto flex-1 md:grow-0">
                                        {searchType === 'id' && (
                                            <>
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="search"
                                                    placeholder="Search by ID..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                                                />
                                            </>
                                        )}
                                    </div>
                                    <Link to="/createorder">
                                        <Button size="sm" className="h-8 gap-1 bg-blue-950">
                                            <PlusCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                Create New Order
                                            </span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <TabsContent value="all">
                                <Card x-chunk="dashboard-06-chunk-0">
                                    <CardHeader>
                                        <CardTitle>Order List</CardTitle>
                                        <CardDescription>
                                            Search and view orders.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>ID</TableHead>
                                                    <TableHead className="hidden md:table-cell">Created at</TableHead>
                                                    <TableHead>Created by user</TableHead>
                                                    <TableHead>Department</TableHead>
                                                    <TableHead>Current status</TableHead>
                                                    <TableHead>
                                                        <span className="sr-only">Actions</span>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {loading ? (
                                                <div className='flex flex-row justify-center'>
                                                    <Loader2 className='h-8 w-8 animate-spin' />
                                                </div>
                                            ) : (
                                                <TableBody>
                                                    {orders.map(order => (
                                                        <OrdersTableRow
                                                            key={order.id}
                                                            id={order.id}
                                                            created_by_name={order.profiles.name}
                                                            created_at={order.created_at}
                                                            department_name={order.departments.name}
                                                            current_status={order.statuses.name}
                                                            onDeleteRefresh={refreshTable}
                                                        />
                                                    ))}
                                                </TableBody>
                                            )}
                                        </Table>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
                                            <span>
                                                Showing <strong>{(currentPage - 1) * ordersPerPage + 1}</strong> to <strong>{Math.min(currentPage * ordersPerPage, count)}</strong> of <strong>{count}</strong> Orders
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </>
    );


}

export default OrderPage;

export default function useSpaces(){
    //   const { data: spaces, isLoading, refetch } = api.spaces.getMySpaces.useQuery();
    
    return{
        spaces:[{
            totalRevenue:12,
            averageRating:12,
            bookingsCount:12,
            title:'',
            status:'',
            id:'',
        }],
        isLoading:false,
        refetch:()=>{}
    }
}
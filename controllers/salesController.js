const Order=require('../models/order_model');

const loadSalesReport=async(req,res)=>{
    try {

        const order=await Order.find({})

        res.render('salesReport',{order})
        
    } catch (error) {
        console.log(error.message);
    }
}


//load dailyreport
const LoadDailyReport=async(req,res)=>{
    try {
        
        const startOfToday = new Date()

        startOfToday.setHours(0, 0, 0, 0)

        const endOfToday = new Date()

        endOfToday.setHours(23, 59, 59, 999)

        const DailyReport = await Order.find({
            orderStatus: 'delivered',
            $expr: {
                $and: [
                    { $gte: ["$orderDate", startOfToday] },
                    { $lte: ["$orderDate", endOfToday] }
                ]
            }
        });
        

        res.render('salesreport',{order:DailyReport})

        console.log(DailyReport)

            } catch (error) {

                console.log(error.message)

            }
}

// load weekly report

const LoadWeeklyReport = async (req, res) => {
    try {
        
        const startOfWeek = new Date()

        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

        startOfWeek.setHours(0, 0, 0, 0)


        const endOfWeek = new Date()

        endOfWeek.setDate(startOfWeek.getDate() + 6)

        endOfWeek.setHours(23, 59, 59, 999)

        
        const weeklyOrders = await Order.find({

            orderDate: { $gte: startOfWeek, $lte: endOfWeek }

        })

        
        res.render('salesreport', { order: weeklyOrders });

        console.log(weeklyOrders)

    } catch (error) {

        console.log(error.message)

        
    }
}

// load monthly report
const LoadMonthlyReport = async (req, res) => {
    try {
        const currentDate = new Date()

      
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        endOfMonth.setHours(23, 59, 59, 999)

       
        const monthlyOrders = await Order.find({

            orderDate: { $gte: startOfMonth, $lte: endOfMonth }
        })

        
        res.render('salesreport', { order: monthlyOrders });

       

    } catch (error) {

        console.log(error.message);
        
    }
};

// load yearly report
const LoadYearlyReport = async (req, res) => {
    try {
       
        const currentDate = new Date()

        
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1)

        const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999)

        
        const yearlyOrders = await Order.find({

            orderDate: { $gte: startOfYear, $lte: endOfYear }
        })

      
        res.render('salesreport', { order: yearlyOrders })

    } catch (error) {

        console.log(error.message)
      
    }
};

const filerdate =    async (req, res) => {
        try {
            console.log('hello'+req.body)

            const startDate = new Date(req.query.startDate)

            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date(req.query.endDate)

            endDate.setHours(23, 59, 59, 999)
    
            const salesReport = await Order.find({

                orderDate: { $gte: startDate, $lte: endDate }
            });
    
            res.render('salesreport', { order: salesReport })

        } catch (error) {

            console.log(error.message)
            
        }
    
    
};

module.exports={
    loadSalesReport,
    LoadDailyReport,
    LoadWeeklyReport,
    LoadMonthlyReport,
    LoadYearlyReport,
    filerdate
}
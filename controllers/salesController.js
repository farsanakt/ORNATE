const Order=require('../models/order_model');

const loadSalesReport=async(req,res)=>{
    try {

        const order=await Order.find({}).populate('products.productId')

        res.render('salesReport',{order,type:''})
        
    } catch (error) {
        
        console.log(error.message);
    }
}


//load dailyreport
const LoadDailyReport=async(req,res)=>{
    try {
        

        const type='daily'

        const startOfToday = new Date()

        startOfToday.setHours(0, 0, 0, 0)

        const endOfToday = new Date()

        endOfToday.setHours(23, 59, 59, 999)

        const DailyReport = await Order.find({

            'products.orderProStatus': 'delivered',
        
            orderDate: { $gte: startOfToday, $lte: endOfToday } 
    
            }).populate('products.productId')
        

        res.render('salesreport',{order:DailyReport,type})

        console.log(DailyReport)

            } catch (error) {

                console.log(error.message)

            }
}

// load weekly report

const LoadWeeklyReport = async (req, res) => {
    try {
        

        const type='weekly'

        const startOfWeek = new Date()

        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

        startOfWeek.setHours(0, 0, 0, 0)


        const endOfWeek = new Date()

        endOfWeek.setDate(startOfWeek.getDate() + 6)

        endOfWeek.setHours(23, 59, 59, 999)

        
        const WeeklyReport = await Order.find({

            'products.orderProStatus': 'delivered',

            orderDate: { $gte: startOfWeek, $lte: endOfWeek }
            
        }).populate('products.productId')

        
        res.render('salesreport', { order: WeeklyReport,type });

        console.log(weeklyOrders)

    } catch (error) {

        console.log(error.message)

        
    }
}

// load monthly report
const LoadMonthlyReport = async (req, res) => {
    try {

        const type='monthly'

        const currentDate = new Date()

      
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        endOfMonth.setHours(23, 59, 59, 999)

       
        const monthlyOrders = await Order.find({

            'products.orderProStatus': 'delivered',

            orderDate: { $gte: startOfMonth, $lte: endOfMonth }
        }).populate('products.productId')

        
        res.render('salesreport', { order: monthlyOrders ,type});

       

    } catch (error) {

        console.log(error.message);
        
    }
};

// load yearly report
const LoadYearlyReport = async (req, res) => {
    try {
       
        const currentDate = new Date()

        const type='yearly'
        
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1)

        const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999)

        
        const yearlyOrders = await Order.find({

            'products.orderProStatus': 'delivered',

            orderDate: { $gte: startOfYear, $lte: endOfYear }
        }).populate('products.productId')

      
        res.render('salesreport', { order: yearlyOrders ,type})

    } catch (error) {

        console.log(error.message)
      
    }
};

const filerdate =    async (req, res) => {
        try {
            console.log('hello'+req.body)

            const type='filerdate'

            const startDate = new Date(req.query.startDate)

            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date(req.query.endDate)

            endDate.setHours(23, 59, 59, 999)
    
            const salesReport = await Order.find({

                'products.orderProStatus': 'delivered',

                orderDate: { $gte: startDate, $lte: endDate }
            }).populate('products.productId')
    
            res.render('salesreport', { order: salesReport,type })

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
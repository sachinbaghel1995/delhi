module.exports=(sequelize,DataTypes)=>{

    const Order=sequelize.define("order",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
          },
        paymentid:{
            type:DataTypes.STRING
            
        },
        orderid:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.STRING
        },
      
    })
return Order
}
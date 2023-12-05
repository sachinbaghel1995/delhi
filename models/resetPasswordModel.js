module.exports=(sequelize,DataTypes)=>{

    const ResetPassword=sequelize.define("resetpassword",{
        id: {
            type: DataTypes.UUID,
           
            allowNull: false,
            primaryKey: true,
          },
     active:{
         type:DataTypes.BOOLEAN
     },
        expiresby:{
            type:DataTypes.DATE
        },
      
    })
return ResetPassword
}
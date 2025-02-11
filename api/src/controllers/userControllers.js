const { order, detailOrder, user, product } = require("../db");

const ShoppinghistoryUser = async (email)=>{

    let us={};
    try {
        us = await user.findOne({where: {email: email}});
        console.log("Usuario Encontrado");
    } catch (error) {
        throw Error("Error al buscar usuario", error);
    }
    
    const usid = us.id;
    let orderuser =[];
    try {
        orderuser = await order.findAll({ where:{userId: usid}});
        console.log("Ordenes de compras encontradas");
    } catch (error) {
        throw Error("Error al buscar ordenes de compras del usuario", error);
    }
    
    let history = [];
    
    for (const o of orderuser) {
        let detOrden = {}
        detOrden = {
            nroOrden: o.id,
            fecha: o.orderDate,
            total: o.totalAmount
        }
        let detail = [];
        try {
            detail = await detailOrder.findAll({where: {orderId: o.id}});
            console.log("Detalles de Ordenes de compras encontradas");
        } catch (error) {
            throw Error("Error al buscar los detalles de las ordenes de compras del usuario", error);
        }
        let detalle = [];
        for (const d of detail) {
            let prod = {};
            try {
                prod = await product.findByPk(d.productId)
                console.log("producto encontrado");
            } catch (error) {
                throw Error("Error al buscar el producto", error);
            }
        
            detalle.push({
                nameproduct: prod.name,
                cantidad: d.quantity,
                precioUni: d.purchaseprice
              });
            }
            
            detOrden = {
              ...detOrden,
              detalle: detalle
            
        }
    console.log("El tetalle completo quedaria :", detOrden);
    history.push(detOrden);   
    }
console.log("Solicitud Completada");
return history;
}

module.exports = { ShoppinghistoryUser };

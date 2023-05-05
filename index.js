
document.getElementById("container").style.display = "none"

let ip;
let poffice;

fetch("https://api.ipify.org?format=json")
.then(res=>res.json())
.then(data=>{
    ip = data.ip;
    document.getElementById("ip").innerText = ip;
})


document.getElementById("get-btn").addEventListener("click",(e)=>{
          
    e.target.style.display = "none";
    document.getElementById("container").style.display = "block"

          if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position=>{
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;            
            document.getElementById("lat").innerText = lat; 
            document.getElementById("long").innerText = lon; 
            
            document.getElementById("map").src = `https://maps.google.com/maps?q=${lat}, ${lon}&output=embed`
          });
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
    
    document.getElementById("ip").innerText = ip;

    // let url = `https://ipinfo.io/${ip}/geo`
    let curl =`https://ipinfo.io/${ip}?token=1f2485293d6a2e`
    fetch(curl)
     .then(response => {return  response.json(); })
     .then(data => {
        console.log(data)
        document.getElementById("city").innerText = data.city;
        document.getElementById("region").innerText = data.region;
        document.getElementById("org").innerText = data.asn.name; // organisation
        document.getElementById("host").innerText = data.asn.domain; //hostname
        document.getElementById("pincode").innerText = data.postal;
        document.getElementById("timezone").innerText = data.timezone;

        // datetime according to the timezone
       let datetime = new Date().toLocaleString("en-IN", { timeZone: data.timezone});
       document.getElementById("datetime").innerText = datetime; // date and time

       //find postoffices by pincode
       fetch(`https://api.postalpincode.in/pincode/${data.postal}`)
       .then(res => res.json())
       .then(data=>{
        document.getElementById("message").innerText = data[0].Message;
        poffice = data[0].PostOffice;
        let cardholder = document.createElement("div")
        cardholder.setAttribute("id", "card-holder");
        document.getElementById("container").appendChild(cardholder)
       
        displayPostOffice(poffice, cardholder);

       
       })
        
  })
  .catch(error => console.log("ERROR: ",error));      

})

function displayPostOffice(arr, holder){
    holder.innerHTML = ''; 
       arr.map(obj=>{
        let card = document.createElement("div");
        card.setAttribute("id", "card")
        let name = document.createElement("p");
        name.innerText="Name: "+obj.Name;
        card.appendChild(name);
        let branchType = document.createElement("p");
        branchType.innerText = "Branch Type: " + obj.BranchType;
        card.appendChild(branchType);
        let delivery_status = document.createElement("p");
        delivery_status.innerText = "Delivery Status: " +obj.DeliveryStatus;
        card.appendChild(delivery_status);
        let district = document.createElement("p");
        district.innerText = "District: "+obj.District;
        card.appendChild(district);
        let division = document.createElement("p");
        division.innerText = "Division: "+obj.Division;
        card.appendChild(division);       
        holder.appendChild(card)
    }) 

};

document.getElementById("search").addEventListener("input", (e)=>{
    let filtered = poffice.filter((item)=>{
         return item.Name.includes(e.target.value);
    })
    let cardholder = document.getElementById("card-holder");
    if(filtered !='')
    displayPostOffice(filtered, cardholder);
    else 
    displayPostOffice(poffice, cardholder);

})




### **Problem statement**

A three-tier architecture is a software architecture pattern where the application is broken down into three logical tiers: the presentation layer, the business logic layer and the data storage layer.
Infrastructure Creation

***Create VPC and Subnets***
•	Creating the VPC with CIDR 10.0.0.0/16.
•	web-subnet-1 and web-subnet-2 resources create the web layer in two availability zones. Notice that we have map_public_ip_on_launch = true
•	application-subnet-1 and application-subnet-2 resources create the application layer in two availability zones. This will be a private subnet.
•	database-subnet-1 and database-subnet-2 resources create the database layer in two availability zones. This will be a private subnet.

***Create Internet Gateway and Route Table***
•	Then will create an Internet Gateway. We will need an Internet Gateway to allow the public subnets to connect to the Internet.
•	The web-rt route table creates a route in the VPC to the Internet Gateway for CIDR 0.0.0.0/0.
•	The next two blocks are associating web-subnet-1 and web-subnet-2 with the web-rt route table.

***Create Web Servers***
•	webserver1 resouces creates a Linux 2 EC2 instance in the us-east-1a availability Zone.
•	ami is set to the ami id for the Linux 2 AMI for the us-east-1 Region. If using a different Region then you’d need to update.
•	vpc_security_group_ids is set to a not yet created Security Group, which will be created in the next section for the Application Load Balancer through terraform script
•	user_data is used to boot strap the instance. Rather than type the code directly, we will reference the install_apache.sh file we created earlier.
•	webserver2 is almost identical except that availability_zone is set to us-east-1b.

***Create Security Groups***
•	Create a Security Group named web-sg with inbound rule opening HTTP port 80 to CIDR 0.0.0.0/0 and allowing all outbound traffic.
•	Create a Security Group named webserver-sg with inbound rule opening HTTP port 80, but this time it’s not open to the world. Instead it will only allowing traffic from the web-sg Security Group.
•	Create a Security Group named database-sg with inbound rule opening MySQL port 3306 and once again we keep security tight by only allow the inbound traffic from the webserver-sg Security Group. We open outbound traffic to all the ephemeral ports.

***Create Application Load Balancer***
1.  An external Application Load Balancer is created.
•	internal is set to false, making it an external Load Balancer.
•	load_balancer_type is set to application designating it an Application Load Balancer.
•	security_groups is set to the web-sg Security Group which allows access from the internet over port 80.
•	subnets is set to both of the web subnets. This designates where the ALB will send traffic and requires a minimum of two subnets in two different AZs.
2. Create an Application Load Balancer Target Group.
3. The aws_lib_target_group_attachment  resource attaches the instances to the Target Group. Note that the depends_on  is to both of these. 
4. Add a listener on port 80 that forwards traffic to the Target Group.

***Create RDS Instance***
1.Create an MySQL RDS Instance. Some attributes to note:
•	db_subnet_group_name is a required field and is set to the aws_db_subnet_group.default.
•	instance_class is set to a db.t2.micro.
•	multi_az is set to true for high availability, but if you’d like to keep costs low, set this to false.
•	username & password will need to be changed.
•	vpc_secuirty_group_ids is set to the database-sg Security Group.
2. Create a DB Subnet Group. subnet_ids identifies which subnets will be used by the Database.

***Provision Infrastructure***
•	If you didn’t do so earlier or you just want to do it again, from the terminal run terraform init .
•	Run terraform fmt . This ensures formatting is correct and will modify the code for you to match.
•	Run terraform validate to ensure there are no syntax errors.
•	Run terraform plan  to see what resources will be created.
•	Run terraform apply to create the infrastructure. Type Yes when prompted or go for terraform apply –auto-approve to skip the prompt message

***Testing***
•	After the infrastructure has been created there should be an Output displayed on the terminal for the Application Load Balancer DNS Name.
•	Copy and paste (without quotations) into a new browser tab. Refresh the page to see the load balancer switch between the two instances.

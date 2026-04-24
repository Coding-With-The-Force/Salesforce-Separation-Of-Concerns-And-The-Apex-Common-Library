# The Builder Pattern

### Video Tutorial 

[![The Builder Pattern](https://yt-embed.herokuapp.com/embed?v=frke3NN0F90)](https://youtu.be/frke3NN0F90 "The Builder Pattern")

***

### What is the Builder Pattern?

[The Builder Pattern](https://refactoring.guru/design-patterns/builder) is a [Creational Design Pattern](https://refactoring.guru/design-patterns/creational-patterns) that allows you to construct a complex object one step at a time. Think about the construction of a car or your house or maybe something less complicated, like the construction of a desktop computer. When you're creating a new desktop computer you have to make a ton of selections to build the computer. You have to get the right cpu, motherboard, etc. Instead of passing all that selection information into a class that constructed the computer, it'd be a lot nicer to build it step by step. Let's check out some examples:


_**Non-Builder Pattern Computer Building Class Example:**_
```
public class ComputerBuilderController(){
    public ComputerCreator createMidTierComputer(){
        return new ComputerCreator(midTierGraphicsCard, midTierCPU, midTierMotherboard, midTierFan, null, null).getComputer();
    }

    public ComputerCreator createTopTierComputer(){
        return new ComputerCreator(topTierGraphicsCard, topTierCPU, topTierMotherboard, topTierFan, topTierNetworkCard, null).getComputer();
    }
}

public class ComputerCreator{
    private CPU compCPU;
    private GPU compGPU;
    private MotherBoard compMotherBoard;
    private Fan compFan;
    private NetworkCard compNetworkCard;
    private Speakers compSpeakers;

    //This could go on for forever and you might have 300 different constructors with different variations of computer parts... This could become
    //an absolutely enormous class.
    public ComputerCreator(GraphicsCard selectedGraphicsCard, CPU selectedCPU, MotherBoard selectedMotherboard, Fan selectedFan, NetworkCard 
    selectedNetworkCard, Speakers selectedSpeakers){
        setComputer(selectedGraphicsCard, selectedCPU, selectedMotherboard, selectedFan, selectedNetworkCard, selectedSpeakers);
    }

    //Because of how this is setup, we're setting everything for the computer, even if we're just setting the computer parts to null
    private void setComputer(GraphicsCard selectedGraphicsCard, CPU selectedCPU, MotherBoard selectedMotherboard, Fan selectedFan, NetworkCard 
    selectedNetworkCard, Speakers selectedSpeakers){
        this.compGPU= selectedGraphicsCard;
        this.compCPU = selectedCPU;
        this.compMotherBoard = selectedMotherboard; 
        this.compFan= selectedFan; 
        this.compNetworkCard = selectedNetworkCard; 
        this.compSpeakers = selectedSpeakers;   
    }

    public ComputerCreator getComputer(){
        return this;
    }
}

```

You can see in the above example, this setup is not exactly ideal, nor does it lend itself to easy code changes. If you go with the single constructor approach and just allow developers to pass in nulls to the constructor, every time you need to add another option for the computers your code might build, you'll have to update every piece of code that calls the ComputerCreator class because the constructor will change. Alternatively if you go with new constructor variations for each new option you could end up with hundreds of constructors over time... also not great at all. That can be extremely confusing and difficult to upkeep. So let's look at how to leverage the builder pattern to achieve the same thing.

_**Builder Pattern Computer Building Class Example:**_
```
public class ComputerBuilderController(){
       
    public ComputerCreator createMidTierComputer(){
        return new ComputerCreator().setCPU(midTierCPU).setGPU(midTierGPU).setMotherBoard(midTierMotherBoard).setFan(midTierFan);
    }

    public void createTopTierComputer(){
        return new ComputerCreator().setCPU(topTierCPU).setGPU(topTierGPU).setMotherBoard(topTierMotherBoard).
        setFan(topTierFan).setNetworkCard(topTierNetworkCard);
    }
}

public class ComputerCreator{
    private CPU compCPU;
    private GPU compGPU;
    private MotherBoard compMotherBoard;
    private Fan compFan;
    private NetworkCard compNetworkCard;
    private Speakers compSpeakers;
    
    public ComputerCreator setCPU(CPU selectedCPU){
        this.compCPU = selectedCPU;
        return this;
    }

    public ComputerCreator setGPU(GPU selectedGPU){
        this.compGPU = selectedGPU;
        return this;
    }

    public ComputerCreator setMotherBoard(MotherBoard selectedMotherBoard){
        this.compMotherBoard = selectedMotherBoard;
        return this;
    }

    public ComputerCreator setFan(Fan selectedFan){
        this.compFan = selectedFan;
        return this;
    }

    public ComputerCreator setNetworkCard(NetworkCard selectedNetworkCard){
        this.compNetworkCard = selectedNetworkCard;
        return this;
    }

    public ComputerCreator setSpeakers(Speaker selectedSpeakers){
        this.compSpeakers= selectedSpeakers;
        return this;
    }
}

```

You can see in the above example that using the builder pattern here gives us an enormous amount of flexibility. We no longer need to pass null values into a constructor or build a bajillion constructor variations, we only need to call the methods to set each piece of the computer should we need to set them. You can see we now only worry about setting values for things we actually need to set for our computer. Additionally, you can add new options for computer parts to set in the ComputerCreator class easily and it won't affect that code that has already been written. For instance if I created a setWebcam method it would be no big deal. My createMidTierComputer and createTopTierComputer methods would not be impacted in any way and continue to function just fine. Builder Pattern FTW!

***

### Why is it Useful?

Take the computer example above, without the builder pattern you get one of two things. You either get an enormous constructor you send all your computer parts to (that you will likely pass a ton of nulls to) or you have a ton of constructors to represent different computer variations... either choice is not a great choice. Complex objects typically have potentially hundreds of optional choices you can make, you need something more robust to select those options.

The builder pattern allows you to select those options piece by piece if you want them. Take for instance the computer example again. Desktop computers do not need things like network cards or speakers or a webcam to function. That being said, many people building a computer may want them for one reason or another to make their specific computer useful for them. Instead making constructor variations for every combination of those items, why not just use the builder pattern to add them as needed? It makes the code a whole lot easier to deal with and easier to extend in the future.

***

### Where does it fit into Separation of Concerns?

Builder classes are typically service classes of some sort, maybe you create some super elaborate Opportunities in your org. You might have an Opportunity_Builder_Service or something along those lines. It can help in a lot of areas to reduce your code in the long term and to increase your codes flexibility for allowing new options for the object you are building, and I think we all know (if you've been doing this long enough), businesses like to add and subtract things from the services they create on a whim. 

***

### Where is it used in the Apex Common Library?

This design pattern is leveraged heavily by the [fflib_QueryFactory](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls) class in the Apex Common Library. It allows us to build complex SOQL queries by building them step by step.

***

### Example Code

The [fflib_QueryFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls) is an example of a class designed using the builder pattern.

The [Case_Selector](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Case_Selector.cls#L43) class I've created has several examples of how it looks when you call and utilize a class leveraging the builder pattern.

***

### Next Section

<a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/13)-The-Selector-Layer " target="_blank">Part 13: The Selector Layer</a>
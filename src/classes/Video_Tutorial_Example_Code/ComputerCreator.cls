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

	public ComputerCreator setSpeakers(Speakers selectedSpeakers){
		this.compSpeakers= selectedSpeakers;
		return this;
	}

	public void createComputer(){
		new ComputerCreator().setCPU(new CPU()).setFan(new Fan());
	}
}

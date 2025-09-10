
# Ambisonic Web Controller over OSC

This project transforms your mobile phone into a wireless OSC controller, perfect for controlling Ambisonic panners, synthesizers, or any other software that accepts OSC messages. It uses your phone's orientation sensors to send Azimuth and Elevation data in real-time.

The data flows from a web application on your phone, through a Node.js WebSocket bridge, to your computer. `ngrok` is used to create secure public URLs, allowing your phone to connect to your computer from anywhere.

## Prerequisites

Before you begin, ensure you have the following installed:

  * **Node.js and npm:** Required to run the WebSocket-to-OSC bridge.
  * **ngrok Account & CLI:** You'll need a free `ngrok` account and the command-line tool installed.
  * **Python 3:** Used for a simple local web server (most systems have this pre-installed).
  * **An OSC Receiver:** Software like Max/MSP, Pure Data, Reaper, etc., ready to receive OSC messages on port **9000**.

-----

## One-Time Setup

You only need to do these steps once.

### 1\. Install Node.js Dependencies

Navigate to your project folder in the terminal and install the necessary Node.js packages:

```bash
# Installs the WebSocket and node-osc libraries
npm install ws node-osc
```

### 2\. Configure `ngrok`

The `ngrok` free plan requires you to define multiple tunnels in a single configuration file.

1.  **Add your authtoken.** Get your token from the [ngrok Dashboard](https://dashboard.ngrok.com/get-started/your-authtoken) and run:
    ```bash
    ngrok config add-authtoken <YOUR_TOKEN_HERE>
    ```
2.  **Create the configuration file.** Run `nano ~/.config/ngrok/ngrok.yml` and paste the following content. The indentation is very important\!
    ```yaml
    # ~/.config/ngrok/ngrok.yml
    version: "2"
    tunnels:
      webapp:
        proto: http
        addr: 8000
      websocket-bridge:
        proto: http
        addr: 8080
    ```
    Save and exit by pressing `Ctrl+X`, then `Y`, then `Enter`.

### 3\. Create a Shell Shortcut (Recommended)

To avoid typing a long command every time, you can create a permanent shortcut.

1.  Open your shell's configuration file (e.g., `nano ~/.zshrc` or `nano ~/.bash_profile`).
2.  Add the following line to the end of the file:
    ```bash
    # Alias to start both ngrok tunnels for the OSC project
    alias ngrok-start="ngrok start --all --config ~/.config/ngrok/ngrok.yml"
    ```
3.  Save the file and reload your shell by opening a new terminal or running `source ~/.zshrc`.

-----

## Usage Instructions

Follow these steps every time you want to run the controller.

1.  **Open your OSC Application** (e.g., Max/MSP) and make sure it's listening for UDP OSC messages on port **9000**.

2.  **Start the Node.js Bridge.** In a new terminal window, run:

    ```bash
    node websocket-osc-bridge.js
    ```

    You should see `WebSocket-to-OSC bridge running on port 8080`.

3.  **Start the Web Server.** In another terminal window, from your project directory, run:

    ```bash
    python3 -m http.server 8000
    ```

4.  **Start `ngrok`.** In a third terminal window, run your shortcut:

    ```bash
    ngrok-start
    ```

    `ngrok` will display two public "Forwarding" URLs.

5.  **Connect Your Phone:**

      * On your phone, open the **`https://...ngrok-free.app`** URL that forwards to `localhost:8000`.
      * Copy the other `ngrok` URL (the one for `localhost:8080`).
      * Paste it into the input field in the web app, but make sure it starts with **`wss://`**.
      * Tap **Enable Sensors** and then **Start Sending**.

You should now see OSC messages in your Node.js terminal and the data flowing into your OSC application\!

-----

## Troubleshooting

  * **`ngrok` Error: "must define at least one tunnel"**: This means your `ngrok.yml` file is missing, empty, or has a syntax error. Double-check the file content and its location (`~/.config/ngrok/ngrok.yml`).
  * **Web App Doesn't Connect**: Ensure the Node.js bridge is running. Verify you pasted the correct `ngrok` URL and that it starts with `wss://`.
  * **No Data in Max/MSP**: Look at the Node.js bridge terminal. If it says "Phone connected," the issue is likely with your Max patch. If it doesn't, the issue is with the phone connection.
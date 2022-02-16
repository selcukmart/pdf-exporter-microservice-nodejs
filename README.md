### What does it do?

It generates PDF from HTML.

### How to use it?

As the first modify config.js according to your configuration.

Call like this:

Call Address

```
https://microservice.xxxyyy.com:2005
```
PHP Example

```php

$arr = [
            'main' =>
                [
                    'content' => $html_content,
                    'filename' => $filename,
                    'footer_desc' => $pdf_footer_desc
                ],
                'auth'=>
                [
                        'client' => $username,
                        'secret' => $password
                ]
]
];

$json_data = json_encode($arr);

$ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Content-Length: ' . strlen($json_data)]
        );
        $result = curl_exec($ch);
        if ($error = curl_error($ch)) {
            $this->setErrorMessage('CURL error: ' . $error);
            curl_close($ch);
            return false;
        }
        curl_close($ch);
        if (isJSON($result)) {
            $result = (array)json_decode($result);
            if (isset($result['auth'])) {
                $this->setErrorMessage('PDF auth problem. Please check username and password!');
                return false;
            }
        }

```